const admin = require('../model/adminModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const banner = require('../model/bannerModel')
const specialization = require('../model/specializationModel')
const doctor = require('../model/doctorModel')

const tokenVerification = async(req,res)=>{
    res.status(200).json({
        status:true,
        admin: req.admin
    })
}

const login = async(req,res)=>{
    const {email,password} = req.body
    try {
        const adminData = await admin.findOne({email,email})
        if(adminData){
            const comparedPassword = await bcrypt.compare(password,adminData.password)
            console.log(comparedPassword);
            if(comparedPassword){
                const token = jwt.sign({id:adminData._id},'adminSecrectKey123',{expiresIn:"2d"})
                res.status(200).json({status:true,token,message:'Successfully Login',admin:adminData})
            }else{
                res.status(400).json({status:false,message:'Incorrect Password'})
            }

        }else{
            res.status(404).json({status:false,message:'User Not Found'})
        }



    } catch (error) {
        console.log(error.message);
    }
}

const bannerUpload = async(req,res)=>{
    try {
        const {name,description} = req.body
        console.log(name,description);
        const newBanner = new banner({
            title,
            description,
            image:req.file.filename
        })
        const  bannerData = await newBanner.save()
        if(bannerData) res.status(201).json({status:true,message:"successfully created"})

    } catch (error) {
        console.log(error.message);
    }
}

const banners = async(req,res)=>{
    try {
        const bannerCollection = await banner.find({is_delete:false})
        res.json({status : true,banners:bannerCollection})
    } catch (error) {
        console.log(error.message);
    }
}

const deleteBanner = async(req,res)=>{
    try {
        console.log('delete');
        console.log(req.body.id);
        const bannerData = await banner.findByIdAndUpdate(req.body.id,{is_delete:true})
        if(bannerData){
            res.json({
                status:true,
                message:'Successfully deleted'
            })
        }
        
    } catch (error) {
        
        console.log(error.message);
        res.json({
            status:false,
            message:"Can't find the data"
        })
    } 
}

const getBanner = async(req,res)=>{
    try {
        const bannerData = await banner.findById({_id:req.params.id})
        if(bannerData){
            res.json({
                status:true,
                banner:bannerData
            })
        }
        

    } catch (error) {
        console.log(error.message)
    }
}

const updateBanner = async(req,res)=>{
    try {
       
        const bannerData = await banner.findByIdAndUpdate({_id:req.bod._id},{
            title:req.bod.title,
            description:req.body.description,
            image:req.file.filename
        })
        if(bannerData){
            res.json({
                status:true,
                banner:bannerData
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const specilizations = async(req,res)=>{
    try {
        console.log('spec');
        const specializationData = await specialization.find({})
        
        res.json({
            status:true,
            specializations:specializationData
        })
    } catch (error) {
        console.log(error.message);
    }
}

const createSpecialization = async(req,res)=>{

    try {
        const {name,description} = req.body
        const specializationData =  new specialization({
            name:name,
            description:description,
            image:req.file.filename
        }).save()
        if(specializationData){
            res.json({status:true,
            message:'successfully Created'
            })

        }
    } catch (error) {
        console.log(error.message);
    }
}

const doctorDetails = async(req,res)=>{
    try {
        const id = req.query.id
        const doctorData = await doctor.findById({_id:id})
        
        if(doctorData){
            res.json({
                status:true,
                doctor:doctorData
            })
        }else{
            res.json({
                status:false,
                message:" can't find the doctor in this id"
            })
        }

        
    } catch (error) {
        console.log(error.message);
    }
}





module.exports = {
    login,
    bannerUpload,
    banners,
    deleteBanner,
    getBanner,
    updateBanner,
    specilizations,
    createSpecialization,
    doctorDetails,
    tokenVerification
}