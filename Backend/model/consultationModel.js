const mongoose = require('mongoose')

const consultaionSchema = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,'User Id required']
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'doctor',
        required:[true,"DoctorId required"]
    }
    ,
    status:{
        type:String,
        enum:['pending','processing','finish'],
        required:[true,"status of consultation required"]
    },
    dateId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },sessionNo:{
        type:Number,
        required:true
    },tokenNo:{
        type:Number,
        required:[true,"tokenNo is required"]
    },
    date:{
        type:Date,
        required:[true,'Date of consultaion Required']
    },
    startingTime:{
        type:Date,
        required:true
    },
    endingTime:{
        type:Date,
        required:true
    },
    videoCallId:{
        type:String,
        required:[true,'videoCallId is required']
    }

})

module.exports = mongoose.model("consultation",consultaionSchema)