const mongoose = require('mongoose')

const timeSlotSchema = mongoose.Schema({
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"doctor",
    },
    duration:{
        type:Number,
        required:true
    }
    ,
    date:{
        type:Date,
        required:true
    },
    
    sessions:[{
        startingTime:{
            type:Date
        },
        endingTime:{
            type:Date
        },
        totalTokens:{
            type:Number
        },
        session:{
            type:Number
        },
        slotes:[{
            tokenNo:{
                type:Number
            },
            start:{
                type:Date
            },
            end:{
                type:Date
            },
            is_Booked:{
                type:Boolean,
                default:false
            },userId:{
                type:mongoose.Schema.Types.ObjectId
            }
        }]
    }]

},{timestamps:true})

module.exports = mongoose.model("scheduledTime",timeSlotSchema)