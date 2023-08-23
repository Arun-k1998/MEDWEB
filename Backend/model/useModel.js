const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
        required:true,
        unique:true
    },
    countryCode:{
        type:Number,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String 
    },
    image:{
        type:String
    },
    notifications:[{

        message:{
            type:String,
            
        },
        view:{
            type:Boolean,
            default:true
        },
        createdAt:{
            type:Date,
            default:new Date()
        }
    }],
    documents:[{
        name:{
            type:String
        },
        image:{
            type:String
        }
    }],
    is_Blocked:{
        type:Boolean,
        default:false
    },
    wallet:{
        type:Number,
        default:0
    },image:{
        type:String
    },
    gender:{
        type:String
    },
    BloodGroup:{
        type:String
    }

})

module.exports = mongoose.model('User',userSchema)