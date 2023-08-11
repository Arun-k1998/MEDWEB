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
const userAuth = require('../middleware/userAuth');
doctor_Route.post('/signup',doctorController.signup)
doctor_Route.post('/verify_otp',doctorController.otpVerification)
doctor_Route.post('/login',doctorController.login)
doctor_Route.get('/register',doctorAuth,doctorController.doctorDetails)
doctor_Route.post('/register',doctorAuth,upload.single('image'),doctorController.updateDoctorDetails)
doctor_Route.post('/timeSchedule',doctorAuth,doctorController.doctorTimeScheduling)
doctor_Route.get('/timeSlotes',doctorAuth,doctorController.timeSlotes )
doctor_Route.post('/deleteSession',doctorAuth,doctorController.deleteTimeSlote)
doctor_Route.post('/updateSlot',userAuth,doctorController.updateSession)
doctor_Route.post('/deleteDate',doctorController.deletScheduledDate)
doctor_Route.get('/profile/:id',doctorAuth,doctorController.getProfile)
doctor_Route.post('/profile',doctorAuth,upload.single('image'),doctorController.updateProfile)
doctor_Route.get('/appointments/:id',doctorAuth,doctorController.getAppointments)
doctor_Route.post('/prescription-c',doctorAuth,doctorController.createPrescription)
doctor_Route.post('/consultation_finish/:consultationId',doctorAuth,doctorController.consultationFinish)
doctor_Route.get('/patients/:doctorId',doctorAuth,doctorController.patients)

doctor_Route.get('/token_v',doctorAuth,doctorController.tokenVerification)


module.exports = doctor_Route