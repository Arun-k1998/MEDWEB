const mongoose = require('mongoose')

const doctorSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    }
    ,
    registerNumber:{
        type:String,
        unique:true
    },
    councilName:{
        type:String,
    },
    yearOfRegisteration:{
        type:Number
    },
    image:{
        type:String
    },
    specialization:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'specialization',
       
    },
    experience:[{
        hospital:{
            type:String
        },
        from:{
            type:Date
        },
        to:{
            type:Date
        }
    }]
    ,
    notifications:[
        {
            notification:{
                type:String
            },
            time:{
                type:Date,
                default:new Date().toLocaleString()
            }
        }
    ],
    age:{
        type:Number,

    }

    ,
    approved:{
        type:String,
        enum:['pending','processing','approved'],
        default:'pending'
    },
    is_Blcoked:{
        type:Boolean,
        default:false
    },
    feePerConsultation:{
        type:Number,
        
    },
   

},{timestamps:true})

module.exports = mongoose.model('doctor',doctorSchema)