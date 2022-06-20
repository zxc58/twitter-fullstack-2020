const express = require('express')
const router = express.Router()
const messageController = require('../../controllers/message-controller')
router.get('/chat/:id', messageController.startChattingWith)
router.get('/', messageController.chatPage)
module.exports = router
