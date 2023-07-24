const express = require('express')
const user_Route = express.Router()


const userController = require('../controller/userController')
const userAuth = require('../middleware/userAuth')
const doctorController = require('../controller/doctorController')
const timeController = require('../controller/timeController')
user_Route.get('/',userController.home)
user_Route.post('/signup',userController.signup)
user_Route.post('/login',userController.login)
user_Route.post('/verify_otp',userController.otpVerification)
user_Route.post('/resendotp',userController.resendOTP)
user_Route.get('/token_v',userAuth,userController.tokenVerification)
user_Route.get('/consult/:name',doctorController.doctorList)
user_Route.get('/timeSlotes/:id',doctorController.sss)
user_Route.get('/doctorSearch/:search',userController.searchDoctor)

 
module.exports = user_Route