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
        include: [{ model: Message, as: 'sentMessages', where: { receiverId: id } }, { model: Message, as: 'receivedMessages', where: { senderId: id } }],
        attributes: { include: [[sequelize.fn('MIN', sequelize.col('sentMessages.beenSeen')), 'allBeenSeen']] },
        group: sequelize.col('User.id'),
        raw: true,
        nest: true
      })
      // console.log(chatUsers.length)
      // res.json(chatUsers)
      res.render('chat', { chatUsers })
    } catch (err) {
      next(err)
    }
  },
  startChattingWith: async (req, res, next) => {
    try {
      const id = helpers.getUser(req).id
      const newId = Number(req.params.id)
      const chatUsers = await User.findAll({
      //
        where: {
          [Op.or]: [sequelize.where(sequelize.col('sentMessages.receiverId'), id), sequelize.where(sequelize.col('receivedMessages.senderId'), id), { id: newId }]
        },
        include: [{ model: Message, as: 'sentMessages', where: { receiverId: id } }, { model: Message, as: 'receivedMessages', where: { senderId: id } }],
        attributes: { include: [[sequelize.fn('MIN', sequelize.col('receivedMessages.beenSeen')), 'allBeenSeen']] },
        group: sequelize.col('User.id'),
        raw: true,
        nest: true
      })

      res.render('chat', { chatUsers, newId })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = messageController
