const doctor = require("../model/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const specialization = require("../model/specializationModel");
const { response } = require("express");
const timeModle = require("../model/doctorTimeSlotModel");
const mongoose = require("mongoose");
const timeSloteModel = require("../model/doctorTimeSlotModel");
const { Vonage } = require("@vonage/server-sdk");
const fs = require("fs");
const path = require("path");
const consultationModel = require("../model/consultationModel");
const moment = require('moment-timezone');
const vonage = new Vonage({
  apiKey: "a3a8bec7",
  apiSecret: "GXxHHP0Ql17HlP2p",
});
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } =
  process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

async function hash(value) {
  const hashData = await bcrypt.hash(value, 10);
  return hashData;
}

const tokenVerification = (req, res) => {
  try {
    if (req.doctor) {
      res.json({
        status: true,
        doctor: req.doctor,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const signup = async (req, res) => {
  const { country_code, phoneNumber, email } = req.body;
  console.log("doctorSignup");
  console.log(country_code, phoneNumber);
  const doctorEmail = await doctor.findOne({ email: email });
  if (!doctorEmail) {
    const doctorPhone = await doctor.findOne({ phoneNumber: phoneNumber });
    if (!doctorPhone) {
      console.log("hello");
      console.log(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID);
      // await client.verify.v2
      //   .services(TWILIO_SERVICE_SID)
      //   .verifications.create({
      //     to: `${country_code}${phoneNumber}`,
      //     channel: "sms",
      //   })
      //   .then((verification) => {
      //     console.log(verification.status);
      //     res.json({
      //         status: true,
      //         message: "successfully created account",
      //       });
      //   })
      //   .catch((err) =>{
      //     console.log('err');
      //     console.log(err.message)});
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
        status: false,
        message: "User Already in this phone Number",
      });
    }
  } else {
    res.json({
      status: false,
      message: "Account already with this email",
    });
  }
  try {
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

    // const verifiedMessage = await client.verify.v2
    //   .services(TWILIO_SERVICE_SID)
    //   .verificationChecks.create({
    //     to: `+${country_code}${phoneNumber}`,
    //     code: otp,
    //   });

    vonage.verify.check(id, otp).then(async (response) => {
      const spassword = await hash(password);
      const newDoctor = new doctor({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        password: spassword,
        countryCode: country_code,
      });
      newDoctor
        .save()
        .then((doctor) => {
          console.log("Saved");
          res.json({
            status: true,
            message: "Successfully Created the User",
          });
        })
        .catch((error) => {
          console.log(error);
          res.json({
            status: false,
            message: "server error",
          });
        });
    });
  } catch (error) {
    console.log(error.message);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("doctor Login" + email);
  try {
    const doctorEmailCheck = await doctor.findOne({ email: email });
    console.log(doctorEmailCheck);
    if (doctorEmailCheck) {
      console.log(1);
      if (!doctorEmailCheck.is_Blocked) {
        console.log(1);

        const comparedPassword = await bcrypt.compare(
          password,
          doctorEmailCheck.password
        );
        console.log(comparedPassword);
        if (comparedPassword) {
          console.log(1);

          const token = await jwt.sign(
            { id: doctorEmailCheck._id },
            process.env.JSON_SECRET_KEY,
            { expiresIn: "2d" }
          );

          res.json({
            token,
            message: "Success",
            doctor: doctorEmailCheck,
          });
        } else {
          res.json({ status: false, message: "Password didn't match" });
        }
      } else {
        res.json({ status: false, message: "Account get blocked" });
      }
    } else {
      res.json({
        status: false,
        message: "email not exit",
      });
    }
  } catch (error) {
    console.log("error");
    res.json({ message: error.message });
  }
};

const doctorDetails = async (req, res) => {
  try {
    console.log("registeration get");
    // console.log(req);
    const id = req.query.id;
    // console.log(id)
    const doctorData = await doctor.findById({ _id: id });
    const specializatonData = await specialization.find({});
    if (doctorData) {
      res.json({
        status: true,
        doctor: doctorData,
        specialization: specializatonData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateDoctorDetails = async (req, res) => {
  try {
    const { formValues, experience } = req.body;

    let newFormValues = JSON.parse(formValues);
    let newExperience = JSON.parse(experience);

    const updatedDoctor = await doctor.findOneAndUpdate(
      {
        _id: newFormValues.id,
      },
      {
        $set: {
          registerNumber: newFormValues.registerNumber,
          councilName: newFormValues.counsilName,
          yearOfRegisteration: new Date(
            newFormValues.yearOfRegisteration
          ).toUTCString(),
          age: parseInt(newFormValues.Age),
          specialization: newFormValues.specialization,
          approved: "processing",
          experience: newExperience,
          image: req?.file?.filename,
          feePerConsultation: newFormValues.consultationFee,
        },
      }
    );
    if (updatedDoctor) {
      console.log("true");
      res.json({
        status: true,
        message: "successfully updated.Please wait for admin approval!",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const doctorsList = async (req, res) => {
  try {
    const doctorList = await doctor.find({
      $and: [{ is_Blcoked: false }, { approved: "processing" }],
    });
    if (doctorList) {
      res.json({
        status: true,
        doctors: doctorList,
      });
    } else {
      res.json({
        status: false,
        message: "No application for process",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const doctorApproval = async (req, res) => {
  try {
    const { id } = req.params;

    await doctor
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            approved: "approved",
          },
        }
      )
      .then((response) => {
        res
          .json({
            status: true,
            message: "Successfully Done",
          })
          .catch((err) => {
            console.log(err.message);
          });
      });
  } catch (error) {
    console.log(error.message);
  }
};

const doctorTimeScheduling = async (req, res) => {
  try {
    const { _id, schedule, duration } = req.body;
    // console.log(_id);
    // console.log("duration ", duration);
    // console.log(schedule);
    console.log(schedule);
    let obj1 = schedule.sessions.map((obj) => {
      console.log("object");
      console.log(obj.startingTime);
      return {
        start: new Date(obj.startingTime).getTime(),
        end: new Date(obj.endingTime).getTime(),
      };
    });
    // console.log(obj1);
    let array;
    let starting = obj1[0].start;
    let count;
    let eachSlot;
    for (let j = 0; j < obj1.length; j++) {
      array = [];
      count = 0;
      eachSlot = {};
      console.log("start");
      for (let i = obj1[j].start; i < obj1[j].end; i = starting) {
        starting = i + parseInt(schedule.duration) * 60 * 1000;
        console.log(new Date(i));
        let newStart = new Date(i);
        console.log(new Date(i).toLocaleString());
        let newend = new Date(starting);
        eachSlot = { tokenNo: count + 1, start: newStart, end: newend };
        array[count] = eachSlot;
        count++;
      }
      // console.log(array);
      schedule.sessions[j].slotes = array;
    }

    const time = new timeModle({
      doctorId: _id,
      date: schedule.date,
      sessions: schedule.sessions,
      duration: schedule.duration,
    });
    await time
      .save()
      .then((response) => {
        res.json({ status: true });
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (error) {
    console.log(error.message);
  }
};

const timeSlotes = async (req, res) => {
  try {
    // const {id,date }= req.query
    // console.log("id ",id);
    // const datee = new Date(date);
    // const formattedDate = datee.toISOString();
    // console.log(formattedDate);
    // const dateSlotes = await timeModle.findOne({$and:[{doctorId:id},{date:formattedDate}]})
    // console.log(dateSlotes);
    // console.log('finish');
    const { id } = req.query;
    const timeSchedules = await timeModle.find(
      { doctorId: id },
      { date: 1, duration: 1, sessions: 1 }
    );
    if (timeSchedules) {
      res.json({
        status: true,
        slotes: timeSchedules,
      });
    } else {
      res.json({
        status: false,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const deleteTimeSlote = async (req, res) => {
  const { id, slotId } = req.body;

  console.log(id);
  console.log(slotId);
  const scheduledDate = await timeSloteModel.findById(id);
  const sessions = scheduledDate.sessions.filter(
    (obj, index) => obj._id != slotId
  );
  console.log(sessions);
  if (!sessions.length) {
    console.log("deleted entirelly");
    await timeSloteModel.deleteOne({ _id: id }).then((response) => {
      res.json({
        status: true,
        message: "Sucessfully Deleted",
      });
    });
  } else {
    console.log("lor ");
    await timeSloteModel
      .findOneAndUpdate({ _id: id }, { sessions: sessions })
      .then((response) => {
        res.json({
          status: true,
          message: "Sucessfully Deleted",
        });
      });
  }
};

const doctorList = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(name, "dsfsf");
    const doctorList = await doctor
      .find({
        $and: [
          { specialization: name },
          { approved: "approved" },
          { is_Blocked: false },
        ],
      })
      .populate("specialization", "name");
    // const timeSlotes = await timeSloteModel.find({doctorId:'64aec98ff79d0a03023e88a5'}).sort({date:1})
    console.log(doctorList);
    // console.log(timeSlotes);
    if (doctorList) {
      res.json({
        status: true,
        doctors: doctorList,
        // timeSlotes:timeSlotes
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: error.message,
    });
  }
};

const sss = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const timeSlotes = await timeSloteModel
      .find({ doctorId: id })
      .sort({ date: 1 });
    const doctorData = await doctor.findById(id).populate('specialization');
    console.log(timeSlotes);
    if (timeSlotes) {
      console.log("successfull");
      res.status(200).json({
        status: true,
        message: "sucess",
        timeSlotes: timeSlotes,
        doctorData: doctorData,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(404).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => { 
  try {
    const { id } = req.params;
    console.log(id);
    const doctorData = await doctor.findById({ _id: id });
    if (doctorData) {
      res.json({
        status: true,
        doctor: doctorData,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id,doctorData } = req.body;
    console.log(JSON.parse(doctorData));
    let newData = JSON.parse(doctorData)
    const doctorDta = await doctor.findById({ _id: id });
    if (doctorDta) {
      const oldImage = doctorDta?.image;
      let newPath;
      if (oldImage) {
        newPath = path.join(
          "C:\\Users\\arunk\\doctorconsultation\\Backend\\public\\images\\",
          oldImage 
        );
      }
      let savedUserData;
      if(req?.file?.filename){
        savedUserData= await doctor.findByIdAndUpdate(
          { _id: id },
        {$set:{...newData, image: req.file.filename,}}
        );
        if (oldImage) fs.unlinkSync(newPath);
      }else{
        console.log('hiiiii');
        savedUserData = await doctor.findByIdAndUpdate(
           id,
          {...newData}
        );
        console.log("-----------------",savedUserData);
      }
      res.json({
        status: true,
        message: "Success",
        user:savedUserData
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
// import 'moment-timezone';


const getAppointments = async (req, res) => {
  const { id } = req.params;

  try {
    
    const currentTimeIST = moment().tz('Asia/Kolkata');
    console.log(currentTimeIST.toDate());
    const consultationList = await consultationModel
      .find({ $and: [{ doctorId: id }, { status: "pending" }
      // ,{
      //   startingTime: { $gte: currentTimeIST.toDate() }
      // }
    ]})
      .populate("doctorId")
      .populate("userId")
      .sort({ date: 1 })
      .sort({ startingTime: 1 });
    console.log(consultationList,'----------------');
    res.json({
      status: true,
      conslutationList: consultationList,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const createPrescription = async(req,res)=>{
  try {
    const {meetId,medicines} = req.body
    console.log('--------------presctiption--------------');
    console.log(meetId);
    console.log(medicines);
    console.log('------end-----------');
    const updatedConsultation = await consultationModel.findByIdAndUpdate(meetId,{prescription:medicines})
    if(updatedConsultation){
      res.json({
        status:true,
        message:'prescription added successfully'
      })
    }
  } catch (error) {
    console.log(error.message);
  }
}

const consultationFinish = async(req,res) => {
  try {
    const {consultationId} = req.params
    if(consultationId){
      const updatedConsultation = await consultationModel.findByIdAndUpdate(consultationId,{status:'finish'})
      if(updatedConsultation) {
        res.json({
          status:true,
          message:'Consultation Finished'
        })
      }
    }

  } catch (error) {
    console.log(error.message);
  }
}

const patients = async(req,res)=>{
  try {
    const {doctorId} = req.params
    console.log(doctorId);

    const patientsList = await consultationModel.find({$and:[{status:'finish'},{doctorId:doctorId}]}).populate('userId').populate('doctorId')
    console.log(patientsList);
    res.json({
      status:true,
      patients:patientsList
    }) 

  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  signup,
  otpVerification,
  login,
  doctorDetails,
  updateDoctorDetails,
  doctorsList,
  doctorApproval,
  tokenVerification,
  doctorTimeScheduling,
  timeSlotes,
  doctorList,
  sss,
  deleteTimeSlote,
  getProfile,
  updateProfile,
  getAppointments,
  createPrescription,
  consultationFinish,
  patients
};
