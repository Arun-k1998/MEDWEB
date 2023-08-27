const messageModel = require('../model/messageModel')

const addMessage = async(req,res)=>{
    
    const {chatId,senderId,text} = req.body
    console.log(req.body,'req.body');
    const message = new messageModel({
        chatId,
        senderId,
        text
    })
    try {
        const result = await message.save()
        res.status(200).json(result)
    } catch (error) {
        console.log(error.message);
        res.status(error.status).json({
            message:error.message
        })
    }
}

const getMessages = async(req,res)=>{
    const {chatId} = req.params
    console.log(chatId);
    try {

        const result = await messageModel.find({chatId})
        console.log(result);
        res.status(200).json(result)
        
    } catch (error) {
        console.log(error.message);
        res.status(error.message)
    }
}

module.exports = {  
    addMessage,
    getMessages
}