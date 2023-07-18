const mongoose = require('mongoose')

const timeSlotSchema = mongoose.Schema({
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"doctor"
    },
    date:{
        type:Date,
        required:true
    },
    slotes:[{
        startingTime:{
            type:String
        },
        endingTime:{
            type:String
        },
        tokens:{
            type:Number
        }
    }]
},{timestamps:true})

module.exports = mongoose.model("scheduledTime",timeSlotSchema)