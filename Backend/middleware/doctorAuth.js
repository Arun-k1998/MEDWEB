const jwt = require('jsonwebtoken')
const doctorModel = require("../model/doctorModel")
async function doctorAuth(req,res,next){
    try {
        const authorization = req.headers['authorization']
        if(!authorization) throw new Error("Doctor Authorization header required")
        const token = authorization.replace('Bearer ','')
        const verification = jwt.verify(token,process.env.JSON_SECRET_KEY)
        const doctorData = await doctorModel.findById({_id:verification.id})
        if(!doctorData) throw new Error('Doctor Not Found')
        req.doctor = doctorData
        next()
        
    } catch (error) {
        console.log(error.message);
        res.status(error.status).json({
            message:error.message
        })
    }
   

}

module.exports = doctorAuth