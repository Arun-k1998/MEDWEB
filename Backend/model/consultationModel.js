const mongoose = require("mongoose");

const consultaionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id required"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: [true, "DoctorId required"],
    },
    status: {
      type: String,
      enum: ["pending",, "processing", "finish","canceled"],
      required: [true, "status of consultation required"],
    }
    ,
    dateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sessionNo: {
      type: Number,
      required: true,
    },
    tokenNo: {
      type: Number,
      required: [true, "tokenNo is required"],
    },
    date: {
      type: Date,
      required: [true, "Date of consultaion Required"],
    },
    startingTime: {
      type: Date,
      required: true,
    },
    endingTime: {
      type: Date,
      required: true,
    },
    videoCallId: {
      type: String,
      required: [true, "videoCallId is required"],
    },
    prescription: [
      {
        medicine: {
          type: String,
        },
        totalDays: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
        morning:{
            type:Boolean,
            default:false
        },
        afterNoon: {
            type:Boolean,
            default:false
        },
        night: {
            type:Boolean,
            default:false
        },
        af: {
            type:Boolean,
            default:false
        },
        bf:{
            type:Boolean,
            default:false
        },
      },
    ],
    is_delete:{
      type:Boolean,
      default:false
    },
    userJoin:{
      type:Boolean,
      default:false
    },
    doctorFee:{
      type:Number
    },
    doctorPayment:{
      type:Number
    },
    adminPayment:{
      type:Number
    }
    ,
    cancelByUser:{
      type:Boolean,
      default:false
    },
    cancelByDoctor:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("consultation", consultaionSchema);
