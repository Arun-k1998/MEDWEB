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
admin_Route.post('/banner',upload.single('image'),adminController.bannerUpload)
admin_Route.get('/banner',adminController.banners)
admin_Route.delete('/banner',adminController.deleteBanner)
admin_Route.get('/banner_u/:id',adminController.getBanner)
admin_Route.post('/banner_u',upload.single('image'),adminController.updateBanner)
admin_Route.get('/specialization',adminController.specilizations)
admin_Route.post('/c_specialization',upload.single('image'),adminController.createSpecialization)
admin_Route.get('/specialization_u',specializationController.getSpecialization)
admin_Route.patch('/specialization_u',upload.single('image'),specializationController.updateSpecialization)
admin_Route.get('/doctors',doctorController.doctorsList)
admin_Route.get('/dr_data',adminController.doctorDetails)
admin_Route.post('/dr_register/:id',doctorController.doctorApproval)

admin_Route.get('/token_v',adminAuth,adminController.tokenVerification)

module.exports = admin_Route