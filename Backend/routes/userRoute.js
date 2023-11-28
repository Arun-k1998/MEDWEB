const express = require('express')
const user_Route = express.Router()



const multer = require('multer')
const path = require('path')


const storage =multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,path.join(__dirname,'../public/userImages'))
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


const userController = require('../controller/userController')
const userAuth = require('../middleware/userAuth')
const doctorController = require('../controller/doctorController')
// const timeController = require('../controller/timeController')


user_Route.get('/',userController.home)
user_Route.post('/signup',userController.signup)
user_Route.post('/login',userController.login)
user_Route.post('/verify_otp',userController.otpVerification)
user_Route.post('/resendotp',userController.resendOTP)

user_Route.get('/consult',doctorController.doctorList)
user_Route.get('/timeSlotes/:id',doctorController.sss) 
user_Route.get('/doctorSearch/:search',userController.searchDoctor)

// user_Route.post('/payment_success',userController.slotBooking)
user_Route.post('/payment-succes',userAuth,userController.slotBookingWithJwt)
// user_Route.post('/webhook',express.raw({type:"application/json"}),userController.testHook)

user_Route.post('/create-checkout-session',userAuth,userController.checkoutSession)
user_Route.get('/appointments/:userId/:type',userAuth,userAuth,userController.getAppointments)

user_Route.get('/meet/:id',userController.meetingId)
user_Route.get('/userJoin',userAuth,userController.updateUserJoin)
user_Route.post('/cancel_appointment/:id',userAuth,userAuth,userController.cancelConsultation)

user_Route.get('/profile/:id',userAuth,userController.getProfile)
user_Route.post('/profile/:id',userAuth,upload.single('image'),userController.updateProfile)
user_Route.get('/prescription/:userId',userAuth,userController.getPrescription)
user_Route.get('/paymentHistory/:userId',userAuth,userController.paymentHistory)
user_Route.patch('/deleteNotification',userAuth,userController.reomvenotification)

// ---------chat----
const chatController = require('../controller/chatController')
user_Route.post('/chat',userAuth,chatController.createChat)
user_Route.get('/chat/:userId',userAuth,chatController.userChats) //to get the all chats of a user
user_Route.get('/chat/find/:firstId/:secondId',userAuth,chatController.findChat) // finding the specific chat with specific person
user_Route.get('/chat/doctor/:doctorId',userAuth,chatController.doctorDetails)

// ----------message-----
const messageController = require('../controller/messageController')

user_Route.post('/message',userAuth,messageController.addMessage) // to add new Message
user_Route.get('/message/:chatId',userAuth,messageController.getMessages)



user_Route.get('/token_v',userAuth,userController.tokenVerification)

module.exports = user_Route