const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require('moment')

//Schema
const users = require("../model/useModel");
const banners = require("../model/bannerModel");
const doctorModel = require("../model/doctorModel");
const specialization = require("../model/specializationModel");
const timeSloteModel = require("../model/doctorTimeSlotModel");
const consultationModel = require("../model/consultationModel");
const nodeMailer = require("nodemailer");
const { Vonage } = require("@vonage/server-sdk");
const vonage = new Vonage({
  apiKey: "a3a8bec7",
  apiSecret: "GXxHHP0Ql17HlP2p",
});

const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST_KEY);
const {CLIENT_URL} = process.env
// const admin = require('../model/adminModel')

// const {TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,TWILIO_SERVICE_SID} = process.env
// const client = require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,{lazyLoading: true})

async function hash(value) {
  const hashData = await bcrypt.hash(value, 10);
  return hashData;
}

const home = async (req, res) => {
  try {
    const bannerData = await banners.find({ is_delete: false });
    const specializationData = await specialization.find({ is_delete: false });
    res.json({
      status: true,
      banners: bannerData,
      specialization: specializationData,
    });
  } catch (error) {
    console.log(error.message);
  }
};
  
const signup = async (req, res) => {
  try {
    const newUser = req.body;
    console.log(newUser.email);
    const userInEmail = await users.findOne({ email: newUser.email });
    const { phoneNumber, country_code } = req.body;
    console.log(phoneNumber, country_code);
    if (!userInEmail) {
      vonage.verify
        .start({
          number: `917907051954`,
          brand: "Vonage",
        })
        .then((resp) => {
          console.log(resp.request_id);

          res.json({
            status: true,
            message: "successfully created account",
            id: resp.request_id,
          });
        })
        .catch((err) => console.error(err));
    } else {
      res.json({
        message: "Email already exits",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const otpVerification = async (req, res) => {
  try {
    const {
      phoneNumber,
      country_code,
      firstName,
      lastName,
      email,
      password,
      otp,
      id,
    } = req.body;

    vonage.verify
      .check(id, otp)
      .then(async (resp) => {
        console.log(resp);
        const spassword = await hash(password);
        const user = new users({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          password: spassword,
          countryCode: country_code,
        });
        const userData = await user.save();
        res.json({
          status: true,
          message: "User Created",
          user: userData,
        });

        console.log(resp);
      })

      .catch((err) => console.error(err));
  } catch (error) {
    console.log(error.message);
  }
};

const resendOTP = async (req, res) => {
  try {
    // const { phoneNumber, country_code } = req.body;
    await vonage.verify
      .start({
        number: `917907051954`,
        brand: "Vonage",
      })
      .then((resp) => {
        console.log(resp.request_id);

        res.json({
          status: true,
          message: "successfully Successfully send otp",
          id: resp.request_id,
        });
      })
      .catch((err) => console.error(err));
  } catch (error) {
    console.log(error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    const user = await users.findOne({ email: email });
    if (user) {
      if (!user.is_Blocked) {
        const comparedPassword = await bcrypt.compare(password, user.password);
        if (comparedPassword) {
          const token = await jwt.sign(
            { id: user._id },
            process.env.JSON_SECRET_KEY,
            { expiresIn: "2d" }
          );

          res.json({
            token,
            message: "Success",
            user: user,
          });
        } else {
          res.json({ message: "Password didn't match" });
        }
      } else {
        res.json({ message: "Account get blocked" });
      }
    } else {
      res.json({
        message: "email not exit",
      });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

const tokenVerification = async (req, res) => {
  try {
    res.json({ status: true, user: req.user });
  } catch (error) {
    console.log(error.message);
  }
};

const searchDoctor = async (req, res) => {
  try {
    const search = req.params.search;
    const doctors = await doctorModel
      .find({
        $and: [
          { firstName: { $regex: ".*" + search + ".*", $options: "i" } },
          { approved: "approved" },
        ],
      })
      .populate("specialization");
    if (doctors.length) {
      console.log(doctors);
      res.json({
        status: true,
        doctors: doctors,
      });
    } else {
      res.json({
        status: false,
        message: "Can't find a doctor in this name",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const slotBooking = async (req, res) => {
  // console.log(req.body);
  // await doctorModel.findById({_id:req.body.doctorId}).then((res)=>{
  //   console.log(res);
  // })
  // console.log(req.body.session.dateId);

  
  const id = req.body.session.dateId;
  const { doctorId, slot, date, userId, session } = req.body;
  const consultation = new consultationModel({
    userId: userId,
    doctorId: doctorId,
    status: "pending",
    date: new Date(date),
    sessionNo: session.session,
    tokenNo: slot.tokenNo,
    dateId: session.dateId,
    startingTime: new Date(slot.start),
    endingTime:new Date(slot.end),
  });
  const bookedConsultaion = await consultation.save();
  console.log(new Date(bookedConsultaion.startingTime).toLocaleString());
  console.log(new Date(bookedConsultaion.endingTime).toLocaleString());

  if (bookedConsultaion) {
    const newDate = await timeSloteModel.findOne({ _id: id });
    newDate.sessions.forEach((session) => {
      if (session.session === req.body.session.session) {
        session.slotes.forEach((slot) => {
          if (slot.tokenNo === req.body.slot.tokenNo) {
            slot.is_Booked = true;
          }
        });
      }
    });
   const updatedSlot=  await newDate.save();
   if(updatedSlot){
    res.json({
      status: true,
    });
   }
    
  }
};

const checkoutSession = async(req,res)=>{
  console.log('iiiiiiiii');
  const price = 'price_1NREKaSDXJuaIyQBDLl7jtSe'
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'INR',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: CLIENT_URL,
    cancel_url:'http://localhost:5173/consult/detail/64aec98ff79d0a03023e88a5',
  });

  res.json( {url:session.url});
}

module.exports = {
  signup,
  login,
  otpVerification,
  resendOTP,
  tokenVerification,
  home,
  searchDoctor,
  slotBooking,
  checkoutSession
};
