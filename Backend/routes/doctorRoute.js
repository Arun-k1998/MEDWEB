const express = require('express')

const multer = require('multer')
const path = require('path')


const storage =multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,path.join(__dirname,'../public/images'))
  },
  filename  : function(req,file,cb){
    const name = Date.now()+'-'+file.originalname;
    cb(null,name);    
  }

});


const fileFilter = (req,file,cb)=>{
  if(file.mimetype ==='image/png' || file.mimetype ==='image/jpg' || file.mimetype ==='image/jpeg' || file.mimetype === 'image/webp'||file.mimetype === 'image/gif'){
      cb(null,true)
  }else{
   
      cb(null,false)
  }
 
}
const upload=multer({storage:storage,fileFilter:fileFilter})

const doctor_Route = express.Router()
const doctorController = require('../controller/doctorController');
const doctorAuth = require('../middleware/doctorAuth');
doctor_Route.post('/signup',doctorController.signup)
doctor_Route.post('/verify_otp',doctorController.otpVerification)
doctor_Route.post('/login',doctorController.login)
doctor_Route.get('/register',doctorController.doctorDetails)
doctor_Route.post('/register',upload.single('image'),doctorController.updateDoctorDetails)
doctor_Route.post('/timeSchedule',doctorController.doctorTimeScheduling)
doctor_Route.get('/timeSlotes',doctorController.timeSlotes )
doctor_Route.post('/deleteSession',doctorController.deleteTimeSlote)
doctor_Route.get('/token_v',doctorAuth,doctorController.tokenVerification)
doctor_Route.get('/profile/:id',doctorController.getProfile)
doctor_Route.post('/profile',upload.single('image'),doctorController.updateProfile)
doctor_Route.get('/appointments/:id',doctorController.getAppointments)

module.exports = doctor_Route