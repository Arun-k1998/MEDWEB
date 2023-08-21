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
const userModel = require("../model/useModel");
const moment = require("moment-timezone");
const specializationModel = require("../model/specializationModel");
const ObjctId = mongoose.Types.ObjectId;

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
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
    res.status(error.status).json({
      message: error.message,
    });
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
    res.status(error.status).json({
      message: error.message,
    });
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
    res.status(error.status).json({
      message: error.message,
    });
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
    res.status(error.status).json({
      message: error.message,
    });
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
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const doctorsList = async (req, res) => {
  try {
    const doctorList = await doctor.find({
      $and: [{ is_Blocked: false }, { approved: "processing" }],
    });
    if (doctorList) {
      console.log(doctorList, "doctorList");
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
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const doctorTimeScheduling = async (req, res) => {
  try {
    const { _id, schedule, duration } = req.body;
    // console.log(_id);
    // console.log("duration ", duration);
    // console.log(schedule);
    console.log(schedule);
    if (!schedule.duration) schedule.duration = 10;
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
    res.status(error.status).json({
      message: error.message,
    });
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
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const deleteTimeSlote = async (req, res) => {
  const { id, slotId } = req.body;

  try {
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
  } catch (error) {
    console.log(error.messag);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const doctorList = async (req, res) => {
  try {
    const { sid } = req.query;
    const filter = req?.query?.filter || "";
    const search = req?.query?.search || "";
    let pageNo = req.query?.page || 1;
    let limit = 2;
    console.log(pageNo,'pageNo');
    let query = {
      approved: "approved",
      is_Blocked: false,
    };
    if (sid) {
      let splitarray = sid.split(",");
      console.log(splitarray);
      query["specialization"] = { $in: splitarray };
    }

    if (search) {
      query["$or"] = [
        { firstName: { $regex: ".*" + search + ".*", $options: "i" } },
        { approved: "approved" },
      ];
    }

    const pagination = await doctor.find(query);
    console.log(pagination,'pagination');

    const doctorList = await doctor
      .find(query)
      .populate("specialization", "name")
      .skip(pageNo > 1 ? (pageNo - 1) * limit : 0)
      .limit(limit);
      console.log(doctorList,'doctorList');
    // console.log(pagination.length); 
    let totalPages = Math.ceil(pagination.length / limit);
    // console.log(totalPages);

    const specilizations = await specializationModel.find(
      { is_delete: false },
      { name: 1 }
    );

    if (doctorList) {
      res.json({
        status: true,
        doctors: doctorList,
        specilizations,
        totalPages,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
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
    const doctorData = await doctor.findById(id).populate("specialization");
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
    res.status(error.status).json({
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
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id, doctorData } = req.body;
    console.log(JSON.parse(doctorData));
    let newData = JSON.parse(doctorData);
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
      if (req?.file?.filename) {
        savedUserData = await doctor.findByIdAndUpdate(
          { _id: id },
          { $set: { ...newData, image: req.file.filename } }
        );
        if (oldImage) fs.unlinkSync(newPath);
      } else {
        console.log("hiiiii");
        savedUserData = await doctor.findByIdAndUpdate(id, { ...newData });
        console.log("-----------------", savedUserData);
      }
      res.json({
        status: true,
        message: "Success",
        user: savedUserData,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};
// import 'moment-timezone';

const getAppointments = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const currentTimeIST = moment().tz("Asia/Kolkata");
    console.log(currentTimeIST.toDate());
    const consultationList = await consultationModel
      .find({
        $and: [
          { doctorId: id },
          { status: "pending" },

          // {
          //   startingTime: { $gt: currentTimeIST.toDate() },
          // },
        ],
      })
      .populate("doctorId")
      .populate("userId")
      .sort({ date: 1 })
      .sort({ startingTime: 1 });
    console.log(consultationList, "----------------");
    res.json({
      status: true,
      conslutationList: consultationList,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const createPrescription = async (req, res) => {
  try {
    const { meetId, medicines } = req.body;
    console.log("--------------presctiption--------------");
    console.log(meetId);
    console.log(medicines);
    console.log("------end-----------");
    const updatedConsultation = await consultationModel.findByIdAndUpdate(
      meetId,
      { prescription: medicines }
    );
    if (updatedConsultation) {
      res.json({
        status: true,
        message: "prescription added successfully",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const getPresctipton = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const consultationData = await consultationModel.findById(consultationId);
    console.log("-----pres==========", consultationData);
    if (consultationData) {
      res.json({
        status: true,
        medicines: consultationData.prescription,
        consultaton: consultationData,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const consultationFinish = async (req, res) => {
  try {
    const { consultationId } = req.params;
    console.log(consultationId);
    if (consultationId) {
      const consulatatonData = await consultationModel.findById(consultationId);
      const timeZone = "Asia/Kolkata";
      let time = moment().tz(timeZone);
      let consultationTime = moment(consulatatonData.startingTime, timeZone);
      if (time < consultationTime) {
        const error = new Error("Can't Update consultaton befor the time ");
        error.status = 400;
        throw error;
      }
      const consultaionFee = consulatatonData.doctorFee;
      const doctorPayment = (consultaionFee * 80) / 100;
      const adminPayment = (consultaionFee * 20) / 100;
      console.log(doctorPayment, adminPayment);
      const updatedConsultation = await consultationModel.findByIdAndUpdate(
        consultationId,
        { status: "finish", doctorPayment, adminPayment }
      );
      if (updatedConsultation) {
        res.json({
          status: true,
          message: "Consultation Finished",
        });
      }
    }
  } catch (error) {
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const patients = async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log(doctorId);

    const patientsList = await consultationModel
      .find({ $and: [{ status: "finish" }, { doctorId: doctorId }] })
      .populate("userId")
      .populate("doctorId")
      .sort({ createdAt: -1 });
    console.log(patientsList);
    res.json({
      status: true,
      patients: patientsList,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const getAllConsultation = async (req, res) => {
  try {
    const { doctorId } = req.params;
    console.log(doctorId);
    const consultation = await consultationModel
      .find({ doctorId: doctorId, status: "finish" })
      .populate("doctorId")
      .populate("userId")
      .populate("dateId");
    if (consultation) {
      console.log("consultation", consultation);
      res.json({
        status: true,
        bookings: consultation,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const updateSession = async (req, res) => {
  try {
    const { startingTime, endingTime, scheduleId, index, duration } = req.body;
    const scheduleData = await timeSloteModel.findById(scheduleId);
    console.log(scheduleData);
    console.log(scheduleData.sessions[index], "----------------");
    // ---------------------------------------------------------------------------------

    // Set the time zone to Asia/Kolkata
    const timeZone = "Asia/Kolkata";

    let start = moment.tz(startingTime, timeZone).valueOf();
    let end = moment.tz(endingTime, timeZone).valueOf();

    let array = [];
    let count = 0;
    let eachSlot = {};
    let starting = start;

    for (let i = start; i < end; i = starting) {
      starting = i + parseInt(duration) * 60 * 1000;
      const newStart = moment.tz(i, timeZone);
      const newEnd = moment.tz(starting, timeZone);
      eachSlot = { tokenNo: count + 1, start: newStart, end: newEnd };
      array[count] = eachSlot;
      count++;
    }
    console.log(array);
    scheduleData.sessions[index].startingTime = startingTime;
    scheduleData.sessions[index].endingTime = endingTime;
    scheduleData.sessions[index].slotes = array;
    scheduleData.sessions[index].totalTokens = array.length;
    scheduleData.sessions[index].session = index + 1;
    const updatedScheduleTime = await scheduleData.save();

    console.log(updatedScheduleTime);
    if (updatedScheduleTime) {
      res.json({
        status: true,
        message: "successfully updated",
      });
    }
  } catch (error) {
    res.status(error.status).json({
      message: error.message,
    });
  }
};

const deletScheduledDate = async (req, res) => {
  try {
    const { dateId } = req.body;

    const deletedScheduleTime = await timeSloteModel.deleteOne({ _id: dateId });
    if (deletedScheduleTime) {
      const scheduledConsultations = await consultationModel.find({
        dateId: dateId,
      });
      await consultationModel.updateMany(
        { dateId, dateId },
        { is_delete: true, status: "canceled" }
      );
      const doctorId = scheduledConsultations[0].doctorId;

      const doctorData = await doctor.findById(doctorId);
      const userIds = scheduledConsultations.map(
        (consultation) => consultation.userId
      );
      console.log(userIds);
      const notificationMessage = `user consultation with doctor ${doctorData.firstName} wil be cancelled due to the in convienience of doctor. paid amount ${doctorData.feePerConsultation} is added to your wallet.`;
      const userNotification = await userModel.updateMany(
        {
          _id: { $in: userIds },
        },
        {
          $push: {
            notifications: {
              message: notificationMessage,
              view: false, // Set the 'view' field to false for new notifications
            },
          },
          $inc: {
            wallet: doctorData.feePerConsultation,
          },
        }
      );
      console.log(userNotification);
      if (deletedScheduleTime) {
        res.json({
          status: true,
          message: "slot deleted Sccessfully. notifications send into user",
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

const dashBoard = async (req, res) => {
  try {
    const weekStart = moment.tz("Asia/Kolkata").startOf("week");
    const weekEnd = moment.tz("Asia/Kolkata").endOf("week");
    const monthStart = moment.tz("Asia/Kolkata").startOf("month");
    const monthEnd = moment().tz("Asia/Kolkata").endOf("month");
    const yearStart = moment.tz("Asia/Kolkata").startOf("Year");
    const yearEnd = moment.tz("Asia/Kolkata").endOf("year");

    const { doctorId } = req.params;
    console.log(doctorId);
    const weekPatientCount = await consultationModel
      .find({
        $and: [
          { doctorId: doctorId },
          { status: "finish" },
          { date: { $gte: weekStart.toDate() } },
          { date: { $lte: weekEnd.toDate() } },
        ],
      })
      .countDocuments();

    const monthlyPatientCount = await consultationModel
      .find({
        $and: [
          { doctorId: doctorId },
          { status: "finish" },
          { date: { $gte: monthStart.toDate() } },
          { date: { $lte: monthEnd.toDate() } },
        ],
      })
      .countDocuments();

    const YearlyPatientCount = await consultationModel
      .find({
        $and: [
          { doctorId: doctorId },
          { status: "finish" },
          { date: { $gte: yearStart.toDate() } },
          { date: { $lte: yearEnd.toDate() } },
        ],
      })
      .countDocuments();

    // const totalPatients = await consultationModel.find({$and:[{doctorId:doctorId},{status:'finish'}]})
    let doctorObjectId = new ObjctId(doctorId);

    const totalConsultationDetails = await consultationModel.aggregate([
      { $match: { status: "finish", doctorId: doctorObjectId } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: "$doctorPayment" },
        },
      },
    ]);
    // console.log(totalConsultationDetails,'totalPatients');

    const currentTime = moment.tz("Asia/Kolkata");
    const sevenDaysAgo = currentTime.clone().subtract(7, "days");
    console.log(currentTime, sevenDaysAgo);

    const weeklyReport = await consultationModel.aggregate([
      {
        $match: {
          doctorId: doctorObjectId,
          status: "finish",
          date: { $gte: sevenDaysAgo.toDate(), $lte: currentTime.toDate() },
        },
      },
      {
        $group: {
          _id: "$date",
          totalAmount: { $sum: "$doctorPayment" },
        },
      },
    ]);

    console.log("durationData", weeklyReport);
    res.json({
      status: true,
      weeklyPatientCount: weekPatientCount,
      monthlyPatientCount: monthlyPatientCount,
      YearlyPatientCount: YearlyPatientCount,
      totalCounsultation: totalConsultationDetails,
      weeklyReportStartingDate: currentTime,
      weeklyReportEndingDate: sevenDaysAgo,
      weeklyReport: weeklyReport,
    });
  } catch (error) {
    console.log(error.message);
    res.status(error.status).json({
      message: error.message,
    });
  }
};

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
  patients,
  updateSession,
  deletScheduledDate,
  getPresctipton,
  getAllConsultation,
  dashBoard,
};
