const doctor = require("../model/doctorModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const specialization = require('../model/specializationModel');
const { response } = require("express");


const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

async function hash(value) {
    const hashData = await bcrypt.hash(value, 10);
    return hashData;
  }

 const signup= async (req, res) => {
    const { country_code, phoneNumber, email } = req.body;
    console.log(country_code,phoneNumber);
    const doctorEmail = await doctor.findOne({ email: email });
    if (!doctorEmail) {
      const doctorPhone = await doctor.findOne({ phoneNumber: phoneNumber });
      if (!doctorPhone) {
        console.log('hello');
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
        await client.verify.
        v2.services(TWILIO_SERVICE_SID)
        .verifications.create({
            to:`${country_code}${phoneNumber}`,
            channel : 'sms'
        }).then(verification=>{
            console.log(verification.status);
            res.json({
                status:true
            })
        }).catch((err)=> console.log(err.message) )

       
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
  }
 const otpVerification= async (req, res) => {
    try {
      const {
        phoneNumber,
        country_code,
        firstName,
        lastName,
        email,
        password,
        otp,
      } = req.body;

      const verifiedMessage= await client.verify.v2.services(TWILIO_SERVICE_SID).
      verificationChecks.create({
       to: `+${country_code}${phoneNumber}`,
       code: otp
      })

      if (verifiedMessage.status === "approved") {
        const spassword = await hash(password);
        const newDoctor = new doctor({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          password: spassword,
          countryCode: country_code,
        });
        newDoctor.save().then((doctor) => {
            console.log('Saved');
          res.json({
            status: true,
            message: "Successfully Created the User",
          });
        }).catch((error)=>{
            console.log(error);
            res.json({
                status:false,
                message:'server error'
            })
        })
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const login = async(req,res)=>{
    const {email,password} = req.body
    console.log("doctor Login"+email);
    try {
        const doctorEmailCheck = await doctor.findOne({email:email})
        console.log(doctorEmailCheck);
        if(doctorEmailCheck){
          console.log(1);
            if(!doctorEmailCheck.is_Blocked){
              console.log(1);

                const comparedPassword = bcrypt.compare(password,doctorEmailCheck.password)
                if(comparedPassword){
                  console.log(1);

                  const token = await jwt.sign({id:doctorEmailCheck._id},process.env.JSON_SECRET_KEY,{expiresIn:'2d'})
                 
                    res.json({
                        token,
                        message:'Success',
                        doctor:doctorEmailCheck
                    })
                }else{
                    res.json({message:"Password didn't match"})
                }
            }else{
                res.json({message:'Account get blocked'})
            }
        }else{
            res.json({
                message:'email not exit'
            })
        }
        
    } catch (error) {
      console.log('error');
        res.json({message:error.message})
    }
    
    
  }

  const doctorDetails = async(req,res)=>{
    try {

      console.log('registeration get');
      // console.log(req);
      const id = req.query.id
      // console.log(id)
      const doctorData = await doctor.findById({_id:id})
      const specializatonData = await specialization.find({})
      if(doctorData){
        res.json({
          status:true,
          doctor:doctorData,
          specialization:specializatonData
        })
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  const updateDoctorDetails = async(req,res)=>{
    try {
      
      const {formValues,experience} = req.body
      
      let newFormValues = JSON.parse(formValues)
      let newExperience = JSON.parse(experience)
      
      const updatedDoctor = await doctor.findOneAndUpdate({
        _id:newFormValues.id
      },{
        $set:{
          registerNumber:newFormValues.registerNumber,
          councilName:newFormValues.counsilName,
          yearOfRegisteration:new Date(newFormValues.yearOfRegisteration).toUTCString(),
          age:parseInt(newFormValues.Age),
          specialization:newFormValues.specialization,
          approved:'processing',
          experience:newExperience,
          image:req.file.filename
        }
      })
      if(updatedDoctor){
        console.log('true');
        res.json({
          status:true,
          message:'successfully updated'
        })
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const doctorsList = async(req,res)=>{
    try {
        const doctorList = await doctor.find({$and:[{is_Blcoked:false},{approved:'processing'}]})
        if(doctorList){
          res.json({
            status:true,
            doctors:doctorList
          })
        }else{
          res.json({
            status:false,
            message:'No application for process'
          })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const doctorApproval = async(req,res)=>{
  try {
    const {id} = req.params

    await doctor.findByIdAndUpdate({_id:id},
    {
      $set:{
        approved:'approved'
      }
    }
    ).then((response)=>{
      res.json({
        status:true,
        message:"Successfully Done"
      }).catch((err)=>{
        console.log(err.message);
      })
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
    doctorApproval
  }

