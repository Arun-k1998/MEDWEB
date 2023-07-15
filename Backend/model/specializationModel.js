const mongoose = require('mongoose')

const specializationModel = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
    },
    doctorsID:{
        type:[String],
        default:[]
    },
    image:{
        type:String
    },
    is_delete:{
        type:Boolean,
        default:false
    }
},{timeStamps:true})

module.exports = mongoose.model('specialization',specializationModel)