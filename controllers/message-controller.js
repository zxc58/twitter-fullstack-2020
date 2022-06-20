const db = require('../models')
const { Op } = require('sequelize')
const { User, sequelize, Message } = db
const helpers = require('../_helpers')
//
const messageController = {
  chatPage: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const chatUsers = await User.findAll({
        where: {
          [Op.or]: [sequelize.where(sequelize.col('sentMessages.receiverId'), id), sequelize.where(sequelize.col('receivedMessages.senderId'), id)]
        },
        include: [
          { model: Message, as: 'sentMessages', where: { receiverId: id }, required: false, order: [[sequelize.col('sentMessages.createdAt'), 'DESC']] },
          { model: Message, as: 'receivedMessages', where: { senderId: id }, required: false, order: [[sequelize.col('receivedMessages.createdAt'), 'DESC']] }
        ],
        // attributes: { include: [[sequelize.fn('MIN', sequelize.col('sentMessages.beenSeen')), 'allBeenSeen']] },
        group: sequelize.col('User.id'),
        raw: true,
        nest: true
      })
      // res.json(chatUsers)
      res.render('chat', { chatUsers })
    } catch (err) {
      next(err)
    }
  },
  startChattingWith: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const newChattingId = Number(req.params.id)
      const chatUsers = await User.findAll({
      //
        where: {
          [Op.or]: [sequelize.where(sequelize.col('sentMessages.receiverId'), id), sequelize.where(sequelize.col('receivedMessages.senderId'), id)]
        },
        include: [{ model: Message, as: 'sentMessages', where: { receiverId: id }, required: false }, { model: Message, as: 'receivedMessages', where: { senderId: id }, required: false }],
        attributes: { include: [[sequelize.fn('MIN', sequelize.col('sentMessages.beenSeen')), 'allBeenSeen']] },
        group: sequelize.col('User.id'),
        raw: true,
        nest: true
      })
      const newChatting = await User.findByPk(newChattingId)
      res.render('chat', { chatUsers, newChatting: newChatting.toJSON() })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = messageController
