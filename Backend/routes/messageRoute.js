const express = require('express')
const router = express.Router()

const messageController = require('../controller/messageController')

router.post('/',messageController.addMessage) // to add new Message
router.get('/:chatId',messageController.getMessages) // to get all messages

module.exports = router