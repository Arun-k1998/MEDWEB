const express = require('express')


const admin_Route = express.Router()

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
const adminController = require('../controller/adminController')
const doctorController = require('../controller/doctorController')
const adminAuth = require("../middleware/adminAuth");
const specializationController = require('../controller/specializationController');

admin_Route.post('/login',adminController.login)

admin_Route.post('/banner',adminAuth,upload.single('image'),adminController.bannerUpload)
admin_Route.get('/banner',adminAuth,adminController.banners)
admin_Route.delete('/banner',adminAuth,adminController.deleteBanner)
admin_Route.get('/banner_u/:id',adminAuth,adminController.getBanner)
admin_Route.post('/banner_u',adminAuth,upload.single('image'),adminController.updateBanner)


admin_Route.get('/specialization',adminAuth,adminController.specilizations)
admin_Route.post('/c_specialization',adminAuth,upload.single('image'),adminController.createSpecialization)
admin_Route.get('/specialization_u',adminAuth,specializationController.getSpecialization)
admin_Route.patch('/specialization_u',adminAuth,upload.single('image'),specializationController.updateSpecialization)

admin_Route.post('/delete_spec/:id')
admin_Route.get('/doctors',adminAuth,doctorController.doctorsList)
admin_Route.get('/dr_data',adminAuth,adminController.doctorDetails)
admin_Route.post('/dr_register/:id',adminAuth,doctorController.doctorApproval)

admin_Route.get("/user_list",adminAuth,adminController.getAllUser)
admin_Route.post('/user_b/:action/:userId',adminAuth,adminController.userBlockAndUnblock)

admin_Route.get('/doctor_list',adminAuth,adminController.getAllDoctors)
admin_Route.post('/doctor_b/:action/:doctorId',adminAuth,adminController.doctorBlockAndUnBlock)

admin_Route.get('/dashBoard',adminAuth,adminController.dashBoard)

admin_Route.get('/token_v',adminAuth,adminController.tokenVerification)

module.exports = admin_Route