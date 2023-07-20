const mongoose = require('mongoose')

const timeSlotSchema = mongoose.Schema({
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"doctor"
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
    // slotes:[{
    //     startingTime:{
    //         type:Date
    //     },
    //     endingTime:{
    //         type:Date
    //     },
    //     tokens:{
    //         type:Number
    //     },slot:{
    //         type:Number
    //     },token:{
    //         type:Number
    //     },
    //     SloteVise:[{
    //         tokenNo:{
    //             type:Number
    //         },
    //         start:{
    //             type:String
    //         },
    //         end:{
    //             type:String
    //         }
    //     }]
    // }]
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
            }
        }]
    }]

},{timestamps:true})

module.exports = mongoose.model("scheduledTime",timeSlotSchema)