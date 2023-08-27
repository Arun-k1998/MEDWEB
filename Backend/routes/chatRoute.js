const express = require('express')
const router = express.Router()

const chatController = require('../controller/chatController')
const userAuth = require('../middleware/userAuth')

router.post('/',chatController.createChat)
router.get('/:userId',chatController.userChats) //to get the all chats of a user
router.get('/find/:firstId/:secondId',chatController.findChat) // finding the specific chat with specific person
router.get('/doctor/:doctorId',chatController.doctorDetails) //to get the details of doctor in the chat 
router.get('/user/:userId',chatController.userDetails)
module.exports = router