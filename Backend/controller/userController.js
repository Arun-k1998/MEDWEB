const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const buffer = require("buffer");
const { v4 } = require("uuid");
const path = require("path"); 
//Schema
const users = require("../model/useModel");
const banners = require("../model/bannerModel");
const doctorModel = require("../model/doctorModel");

const specialization = require("../model/specializationModel");
const timeSloteModel = require("../model/doctorTimeSlotModel");
const consultationModel = require("../model/consultationModel");
const nodeMailer = require("nodemailer");
const fs = require("fs");

const otpGenerator = () => {
  const otp = Math.floor(Math.random() * 1000000);
  return otp;
};

const EmailOtp = {};

const noedeMailerconnect = (email) => {
  const otp = otpGenerator();
  console.log(otp);
  EmailOtp[email] = otp;

  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,

    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: false,

    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  });
  var mailOptions = {
    from: process.env.USER_EMAIL,
    to: email,
    subject: "Otp for registration is: ",
    html: `<h3>OTP for account verification  </h3>" '<hr />'
      <h1 style='font-weight:bold;'> OTP from MEDWEB is ${otp}</h1>`, // html body
  };

  const sendMail = { transporter, mailOptions };

  return sendMail;
};

const { Vonage } = require("@vonage/server-sdk");
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
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
    res.status(error.status).json({
      message: error.message,
    });
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
      const phoneNumberChecking = await users.findOne({
        phoneNumber: phoneNumber,
      });
      if (!phoneNumberChecking) {
        // var mailOptions = {
        //   from: "medwebdoctors@gmail.com",
        //   to: newUser.email,
        //   subject: "Otp for registration is: ",
        //   html:
        //     `<h3>OTP for account verification  </h3>" '<hr />'
        //     <h1 style='font-weight:bold;'> OTP from MEDWEB is ${otp}</h1>`, // html body
        // };
        const sendMail = noedeMailerconnect(newUser.email);
        console.log(EmailOtp); 

        sendMail.transporter.sendMail(sendMail.mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            res.json({
              status: false,
              message: "otp creation fail",
            });
          } else {
            console.log("success");
            console.log(info);
            res.json({ status: true, message: "successfully Send the email" });
          }
          // res.render("otppage", { status: "false" });
        });

      
      } else {
        res.json({
          status: false,
          message: "Phone Number already exit",
        });
      }
    } else {
      console.log(userInEmail);
      res.json({
        message: "Email already exits",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
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
    console.log(req.body);

   
    console.log(EmailOtp);
    if (otp == EmailOtp[email]) {
      delete EmailOtp[email];

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
        message: "Successfully Created Account.Please Login",
        user: userData,
      });
    } else {
      const error = new Error("Wrong otp ");
      error.status = 401;
      throw error;
    }

   
  } catch (error) {
    console.log(error.message);
    console.log(error.status);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const {email} = req.body
console.log('start');
    const sendMail = noedeMailerconnect(email);
    sendMail.transporter.sendMail(sendMail.mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.json({
          status: false,
          message: "otp creation fail",
        });
      } else {
        console.log("success");
        console.log(info);
        res.json({ status: true, message: "Successfully resend OTP" });
      }
      // res.render("otppage", { status: "false" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
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
        res.status(401).json({ message: "Account get blocked" });
      }
    } else {
      res.json({
        message: "email not exit",
      });
    }
  } catch (error) {
    res.status(error.statu).json({ message: error.message });
  }
};

const tokenVerification = async (req, res) => {
  try {
    res.json({ status: true, user: req.user });
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
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
    res.status(error.status).json({
      message: error.message,
    });
  }
};

// const slotBooking = async (req, res) => {
//   // console.log(req.body);
//   // await doctorModel.findById({_id:req.body.doctorId}).then((res)=>{
//   //   console.log(res);
//   // })
//   // console.log(req.body.session.dateId);

//   // const id = req.body.session.dateId;
//   // const { doctorId, slot, date, userId, session } = req.body;
//   const payload = req.rawBody.toString();
//   const rawBody = JSON.parse(payload);
//   console.log("payload---------------------", rawBody);
//   try {
//     const event = req.body;
//     // console.log(req);
//     console.log(rawBody);
//     let b = Object.keys(rawBody.data.object.metadata);
//     // Verify the event to ensure it's from Stripe
//     console.log("-----------------b--------------", b);
//     if (b.length) {
//       const signature = req.headers["stripe-signature"];
//       console.log("signature---------------------------------", signature);
//       const sperateSignature = signature.split(",");
//       const originalSignature = sperateSignature.shift();
//       let c = sperateSignature.join(",");
//       const webhookSecret = process.env.WEB_SOCKET;
//       console.log(webhookSecret); // Replace with your actual webhook secret

//       let stringRaw = rawBody.toString();

//       const eventVerified = stripe.webhooks.constructEvent(
//         stringRaw,
//         signature,
//         webhookSecret
//       );
//       console.log(
//         "eventVerified----------------------------------",
//         eventVerified
//       );

//       if (eventVerified.type === "checkout.session.completed") {
//         console.log(" insideif in event verfied-------------------------");
//         // Payment successfully completed
//         const sessionId = eventVerified.data.object.id;
//         console.log(" session id ----------------------", sessionId);
//         // Now you can retrieve the session details from Stripe
//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         // Extract metadata from the session
//         const metadata = session.metadata;
//         const doctorId = metadata.doctorId;
//         const patientName = metadata.slot;
//         console.log(doctorId);
//         console.log(patientName);
//         console.log("successsssssss");
//       }
//     }
//   } catch (error) {
//     console.log(
//       "------error-----------------------------------------------------",
//       error.message
//     );
//   }

//   // const consultation = new consultationModel({
//   //   userId: userId,
//   //   doctorId: doctorId,
//   //   status: "pending",
//   //   date: new Date(date),
//   //   sessionNo: session.session,
//   //   tokenNo: slot.tokenNo,
//   //   dateId: session.dateId,
//   //   startingTime: new Date(slot.start),
//   //   endingTime:new Date(slot.end),
//   // });
//   // const bookedConsultaion = await consultation.save();
//   // console.log(new Date(bookedConsultaion.startingTime).toLocaleString());
//   // console.log(new Date(bookedConsultaion.endingTime).toLocaleString());

//   // if (bookedConsultaion) {
//   //   const newDate = await timeSloteModel.findOne({ _id: id });
//   //   newDate.sessions.forEach((session) => {
//   //     if (session.session === req.body.session.session) {
//   //       session.slotes.forEach((slot) => {
//   //         if (slot.tokenNo === req.body.slot.tokenNo) {
//   //           slot.is_Booked = true;
//   //         }
//   //       });
//   //     }
//   //   });
//   //  const updatedSlot=  await newDate.save();
//   //  if(updatedSlot){
//   //   res.json({
//   //     status: true,
//   //   });
//   //  }

//   // }
// };

const checkoutSession = async (req, res) => {
  const { doctorId, slot, date, userId, sessions, paymentMethod } = req.body;

  try {
    const doctorData = await doctorModel.findOne({ _id: doctorId });
    const consultationFee = doctorData.feePerConsultation;

    console.log("-----paymentMethod-----", paymentMethod);

    if (paymentMethod === "wallet") {
      const userData = await users.findById(userId);
      console.log(userData);
      console.log(userData.wallet);
      console.log(consultationFee);
      if (userData.wallet < consultationFee) {
        console.log("fail");
        res.json({
          status: false,
          message: "Your Account doesn't have enough balance",
        });
        console.log("kkkk");
      } else {
        const videoCallId = v4();
        console.log("--------uuid----", videoCallId);
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
          videoCallId: videoCallId,
          doctorFee: doctorData.feePerConsultation,
        });
        const bookedConsultaion = await consultation.save();
        await users.findByIdAndUpdate(userId, {
          $set: {
            wallet: userData.wallet - consultationFee,
          },
        });
        // console.log(new Date(bookedConsultaion.startingTime).toLocaleString());
        // console.log(new Date(bookedConsultaion.endingTime).toLocaleString());
        console.log(bookedConsultaion);
        if (bookedConsultaion) {
          const newDate = await timeSloteModel.findOne({
            _id: sessions.dateId,
          });
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
              type: "wallet",
            });
          }
        }
      }
    } else if (paymentMethod == "reschedule") {
      console.log("reschduling started");
      const { consultationId } = req.body;
      const consulatatonData = await consultationModel.findOne({
        $and: [{ _id: consultationId }, { status: "pending" }],
      });
      if (!consulatatonData) {
        const error = new Error("couldn't find Your booking information");
        error.status = 404;
        throw error;
      }
      console.log(slot.start);
      console.log(req.body);
      const formattedDate = slot.start.replace(/\.\d{3}Z$/, "Z");
      const formattedStartingTime = slot.start.replace(/\.\d{3}Z$/, "Z");
      const formattedEndingTime = slot.end.replace(/\.\d{3}Z$/, "Z");

      const timezoneDate = moment(formattedDate).tz("Asia/Kolkata");
      const timezoneStartingTime = moment(formattedStartingTime).tz(
        "Asia/Kolkata"
      );
      const timezoneEndingTime = moment(formattedEndingTime).tz("Asia/Kolkata");

      const updatedConsultation = await consultationModel.findByIdAndUpdate(
        consultationId,
        {
          date: timezoneDate,
          sessionNo: sessions.session,
          tokenNo: slot.tokenNo,
          dateId: sessions.dateId,
          startingTime: timezoneStartingTime,
          endingTime: timezoneEndingTime,
        }
      );
      const tokenNo = slot.tokenNo;

      if (updatedConsultation) {
        // updating previous slot to open to other user
        const timeScheduleData = await timeSloteModel.findById(
          consulatatonData.dateId
        );
        timeScheduleData.sessions.forEach((session, index) => {
          if (consulatatonData.sessionNo - 1 === index) {
            session.slotes.forEach((slot) => {
              if (slot.tokenNo === consulatatonData.tokenNo)
                slot.is_Booked = false;
            });
          }
        });
        await timeScheduleData.save();

        const newDate = await timeSloteModel.findOne({
          _id: sessions.dateId,
        });
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

        console.log("rescheduling ended");
        res.json({ status: true, message: "Successfully Rescheduled " });
      }
    } else {
      console.log("----------online--------");
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

        res.json({
          status: true,
          url: session.url,
          token: token,
          type: "online",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
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
    const consultationDetails = jwt.verify(
      req.body.booking,
      process.env.JSON_SECRET_KEY
    );
    const { doctorId, slot, date, userId, sessions } = consultationDetails;
    const doctorData = await doctorModel.findById(doctorId);

    if (paymentChecking.payment_status === "paid") {
      console.log(consultationDetails);

      console.log("doctorData", doctorData);

      // const DoctorData = await doctorModel.findOne({_id:doctorId})
      // const userData = await users.findOne({_id:userId})
      ("------------------------");
      // if(!userData) throw new Error('JWT token is mismatching')
      const videoCallId = v4();
      console.log("--------uuid----", videoCallId);
      const consultation = new consultationModel({
        userId: userId,
        doctorId: doctorId,
        status: "pending",
        // date: new Date(date),
        date: moment(date).tz("Asia/Kolkata").toDate(),
        sessionNo: sessions.session,
        tokenNo: slot.tokenNo,
        dateId: sessions.dateId,
        // startingTime: new Date(slot.start),
        startingTime: moment(slot.start).tz("Asia/Kolkata").toDate(),
        endingTime: moment(slot.end).tz("Asia/Kolkata").toDate(),
        // endingTime: new Date(slot.end),
        videoCallId: videoCallId,
        doctorFee: doctorData.feePerConsultation,
      });
      const bookedConsultaion = await consultation.save();
      // console.log(new Date(bookedConsultaion.startingTime).toLocaleString());
      // console.log(new Date(bookedConsultaion.endingTime).toLocaleString());
      console.log(bookedConsultaion);
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
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { userId, type } = req.params;
    let query;
    if (type === "upcoming") query = "pending";
    else if (type === "consulted") query = "finish";
    const currentTimeIST = moment().tz("Asia/Kolkata");
    console.log(currentTimeIST.toDate());
    const appointmentsList = await consultationModel
      .find({
        $and: [
          { userId: userId },
          { status: query },
          { is_delete: false },
          // {
          //   startingTime: { $gt: currentTimeIST.toDate() },
          // },
        ],
      })
      .populate("doctorId")
      .populate("userId")
      .sort({ date: 1 });

    if (appointmentsList) {
      // console.log(app);
      res.status(202).json({
        status: true,
        appointments: appointmentsList,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const meetingId = async (req, res) => {
  const { id } = req.params;
  console.log("----meetingId======", id);
  try {
    const consultaion = await consultationModel
      .findById(id)
      .populate("userId")
      .populate("doctorId");
    console.log(consultaion);
    if (consultaion) {
      res.json({ status: true, meetingId: consultaion });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const updateUserJoin = async (req, res) => {
  const { consulatationId } = req.body;
  console.log("userJoinUpdate", consulatationId);
  try {
    const userJoin = await consultationModel.findByIdAndUpdate(
      consulatationId,
      { userJoin: true }
    );
    if (userJoin) {
      res.json({
        status: true,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const cancelConsultation = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    console.log(appointmentId);
    const consultationData = await consultationModel.findOne({
      _id: appointmentId,
    });
    console.log("----------consultationDetails--------", consultationData);
    const { sessionNo, tokenNo, doctorId, userId, dateId } = consultationData;
    await consultationModel.updateOne(
      { _id: appointmentId },
      { status: "canceled" }
    );
    const timeScheduleData = await timeSloteModel.findById(dateId);
    timeScheduleData.sessions.forEach((session, index) => {
      if (sessionNo - 1 === index) {
        session.slotes.forEach((slot) => {
          if (slot.tokenNo === tokenNo) slot.is_Booked = false;
        });
      }
    });
    const updatedSlot = await timeScheduleData.save();
    const updatedConsultationDatas = await consultationModel.find({
      userId: userId,
    });
    const doctorData = await doctorModel.findById(doctorId);
    const { feePerConsultation } = doctorData;
    console.log(feePerConsultation);
    console.log(userId);
    const walletAmount = await users.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          wallet: feePerConsultation,
        },
      },
      { new: true }
    );
    console.log(walletAmount);

    if (updatedSlot) {
      res.json({
        status: true,
        message: "Consultation Cancelled.",
        consultations: updatedConsultationDatas,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await users.findById(userId, { password: 0 });
    console.log(userData);

    if (req.user) {
      res.json({
        status: true,
        user: userData,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, user } = req.body;
    console.log(user);
    const parsedData = JSON.parse(user);
    console.log(parsedData);
    const profileImage = req?.file?.filename;
    // console.log(req.file);
    // console.log(profileImage);
    const userData = await users.findById(userId);
    // console.log(userData,userId);
    if (profileImage) {
      await users.findByIdAndUpdate(userId, {
        image: profileImage,
      });
      if (userData.image) {
        const oldImage = path.join(
          "C:\\Users\\arunk\\doctorconsultation\\Backend\\public\\userImages",
          userData.image
        );
        fs.unlinkSync(oldImage);
      }
    }
    const updatedUser = await users.findByIdAndUpdate(userId, {
      firstName: parsedData?.firstName,
      lastName: parsedData?.lastName,
      phoneNumber: parsedData?.phoneNumber,
      email: parsedData?.email,
    });

    if (updatedUser) {
      res.json({
        status: true,
        message: "successfully updated",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const getPrescription = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);

  try {
    const consultationData = await consultationModel
      .find({ userId: userId })
      .populate("");
    res.json({
      status: true,
      consulation: consultationData,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const paymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = users.findById(userId);

    const paymentHistory = consultationModel
      .find({
        userId: userId,
        status: { $in: ["finish", "canceled"] },
      })
      .populate("doctorId")
      .sort({ date: 1 });

    Promise.all([userData, paymentHistory]).then(
      ([userData, paymentHistory]) => {
        console.log(paymentHistory);
        res.json({
          status: true,
          paymentHistory,
          userData,
        });
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const reomvenotification = async(req,res)=>{
  const notificationId = req.body.id
  const {userId} = req.body
  console.log(notificationId);

  const notificationDelete = await users.findByIdAndUpdate(
    userId,
    {
      $set: {
        [`notifications.${notificationId}.view`]: false
      }
    },
    { new: true })

    console.log(notificationDelete);
  if(notificationDelete){
    res.json({
      status:true,
      message:'notification deleted successfully',
      index:notificationId
    })
  }
}

module.exports = {
  signup,
  login,
  otpVerification,
  resendOTP,
  tokenVerification,
  home,
  searchDoctor,
  // slotBooking,
  checkoutSession,
  testHook,
  slotBookingWithJwt,
  getAppointments,
  meetingId,
  cancelConsultation,
  getProfile,
  updateProfile,
  getPrescription,
  updateUserJoin,
  paymentHistory,
  reomvenotification
};
