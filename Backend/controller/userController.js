const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const buffer = require("buffer");

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

const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST_KEY);
const { CLIENT_URL } = process.env;
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

  // const id = req.body.session.dateId;
  // const { doctorId, slot, date, userId, session } = req.body;
  const payload = req.rawBody.toString();
  const rawBody = JSON.parse(payload);
  console.log("payload---------------------", rawBody);
  try {
    const event = req.body;
    // console.log(req);
    console.log(rawBody);
    let b = Object.keys(rawBody.data.object.metadata);
    // Verify the event to ensure it's from Stripe
    console.log("-----------------b--------------", b);
    if (b.length) {
      const signature = req.headers["stripe-signature"];
      console.log("signature---------------------------------", signature);
      const sperateSignature = signature.split(",");
      const originalSignature = sperateSignature.shift();
      let c = sperateSignature.join(",");
      const webhookSecret = process.env.WEB_SOCKET;
      console.log(webhookSecret); // Replace with your actual webhook secret

      let stringRaw = rawBody.toString();

      const eventVerified = stripe.webhooks.constructEvent(
        stringRaw,
        signature,
        webhookSecret
      );
      console.log(
        "eventVerified----------------------------------",
        eventVerified
      );

      if (eventVerified.type === "checkout.session.completed") {
        console.log(" insideif in event verfied-------------------------");
        // Payment successfully completed
        const sessionId = eventVerified.data.object.id;
        console.log(" session id ----------------------", sessionId);
        // Now you can retrieve the session details from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Extract metadata from the session
        const metadata = session.metadata;
        const doctorId = metadata.doctorId;
        const patientName = metadata.slot;
        console.log(doctorId);
        console.log(patientName);
        console.log("successsssssss");
      }
    }
  } catch (error) {
    console.log(
      "------error-----------------------------------------------------",
      error.message
    );
  }

  // const consultation = new consultationModel({
  //   userId: userId,
  //   doctorId: doctorId,
  //   status: "pending",
  //   date: new Date(date),
  //   sessionNo: session.session,
  //   tokenNo: slot.tokenNo,
  //   dateId: session.dateId,
  //   startingTime: new Date(slot.start),
  //   endingTime:new Date(slot.end),
  // });
  // const bookedConsultaion = await consultation.save();
  // console.log(new Date(bookedConsultaion.startingTime).toLocaleString());
  // console.log(new Date(bookedConsultaion.endingTime).toLocaleString());

  // if (bookedConsultaion) {
  //   const newDate = await timeSloteModel.findOne({ _id: id });
  //   newDate.sessions.forEach((session) => {
  //     if (session.session === req.body.session.session) {
  //       session.slotes.forEach((slot) => {
  //         if (slot.tokenNo === req.body.slot.tokenNo) {
  //           slot.is_Booked = true;
  //         }
  //       });
  //     }
  //   });
  //  const updatedSlot=  await newDate.save();
  //  if(updatedSlot){
  //   res.json({
  //     status: true,
  //   });
  //  }

  // }
};

const checkoutSession = async (req, res) => {
  console.log("iiiiiiiii");

  const { doctorId, slot, date, userId, sessions } = req.body;

  try {
    const doctorData = await doctorModel.findOne({ _id: doctorId });

    if (doctorData) {
      const token = await jwt.sign(
        {
          doctorId: doctorId,
          slot: slot,
          date: date,
          userId: userId,
          sessions: sessions,
        },
        process.env.JSON_SECRET_KEY,
        { expiresIn: "1d" }
      );

      // console.log('----------------------token----------------',token);
      const consultationFee = doctorData.feePerConsultation;

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "INR",
              product_data: {
                name: `${doctorData.firstName} ${doctorData.lastName} Appointment`,
              },
              unit_amount: consultationFee,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:
          "http://localhost:5173/consult/detail/64aec98ff79d0a03023e88a5",
      });

      // res.cookie('booking',token , {

      //   path:`/${session.url}`,
      //   httpOnly: true, // This makes the cookie accessible only by the server, not by JavaScript in the frontend
      //   maxAge: 24 * 60 * 60 * 1000, // Optional: cookie expiration time (milliseconds), e.g., 1 day
      //   secure: true, // Optional: set this to true if the website uses HTTPS
      // })
      res.json({ url: session.url, token: token });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const testHook = (req, res) => {
  console.log("sdfsdf");
  let rawBody = req.rawBody;
  console.log(rawBody);
  const webhookSecret =
    "whsec_bfccc588a42a61ca9a15a5ed30aa4d6634c5cdeff40916df85cab057229ec29e";
  const sig = req.headers["stripe-signature"];
  console.log(sig);
  let event;

  let payload;
  if (Buffer.isBuffer(rawBody)) {
    payload = rawBody.toString();
  } else if (typeof rawBody === "string") {
    payload = rawBody;
  } else {
    payload = rawBody.toString();
    // throw new Error('Invalid payload type. Payload must be a string or a Buffer.');
  }

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log("hello");
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

const slotBookingWithJwt = async (req, res) => {
  // console.log(req.body.booking);

  try {
    const { paymentId } = req.body;
    const paymentChecking = await stripe.checkout.sessions.retrieve(paymentId);
    console.log(paymentChecking);
    console.log(paymentChecking.payment_status);
    if (paymentChecking.payment_status === "paid") {
      const consultationDetails =  jwt.verify(
        req.body.booking,
        process.env.JSON_SECRET_KEY
      );
      console.log(consultationDetails);
      const { doctorId, slot, date, userId, sessions } = consultationDetails;
      console.log(doctorId);
        // const DoctorData = await doctorModel.findOne({_id:doctorId})
      // const userData = await users.findOne({_id:userId})
      ("------------------------");
      // if(!userData) throw new Error('JWT token is mismatching')
      const consultation = new consultationModel({
        userId: userId,
        doctorId: doctorId,
        status: "pending",
        date: new Date(date),
        sessionNo: sessions.session,
        tokenNo: slot.tokenNo,
        dateId: sessions.dateId,
        startingTime: new Date(slot.start),
        endingTime: new Date(slot.end),
      });
      const bookedConsultaion = await consultation.save();
      console.log(new Date(bookedConsultaion.startingTime).toLocaleString());
      console.log(new Date(bookedConsultaion.endingTime).toLocaleString());

      if (bookedConsultaion) {
        const newDate = await timeSloteModel.findOne({ _id: sessions.dateId });
        console.log("---------------newData-----", newDate);
        newDate.sessions.forEach((session) => {
          if (session.session === sessions.session) {
            session.slotes.forEach((updateSlot) => {
              if (updateSlot.tokenNo === slot.tokenNo) {
                updateSlot.is_Booked = true;
              }
            });
          }
        });
        const updatedSlot = await newDate.save();
        if (updatedSlot) {
          console.log("successfull");
          res.json({
            status: true,
          });
        }
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  signup,
  login,
  otpVerification,
  resendOTP,
  tokenVerification,
  home,
  searchDoctor,
  slotBooking,
  checkoutSession,
  testHook,
  slotBookingWithJwt,
};
