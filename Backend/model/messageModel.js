const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    chatId:{
        type:String
    },
    senderId:{
        type:String
    },
    text:{
        type:String
    }
},{
    timestamps:true
})

module.exports = mongoose.model('messge',messageSchema)