const mongoose = require('mongoose')

const timeSlotSchema = mongoose.Schema({
    doctorId:{
        type: mongoose.Schema.Types.ObjectId
    },
    date:{
        type:Date,
        required:true
    },
    slotes:[{
        startingTime:{
            type:Date
        },
        endingTime:{
            type:Date
        },
        tokens:{
            type:Number
        }
    }]
},{timestamps:true})

module.exports = timeSlotSchema