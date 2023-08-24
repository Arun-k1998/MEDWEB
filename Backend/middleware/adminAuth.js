const jwt = require("jsonwebtoken");
const adminModel = require("../model/adminModel");

const adminAuth = async(req,res,next)=>{
    try {
        const authorization = req.headers['authorization']
        if(!authorization) throw new Error('Authorization failed')
        const token = authorization.replace('Bearer ',"")
        const verification = jwt.verify(token,process.env.ADMIN_SECRET_KEY)
        if(!verification) throw new Error("Invalid Token")
        const adminData = await adminModel.findById({_id:verification.id})
        if(!adminData) throw new Error('Admin not found')
        req.admin = adminData
        next()
    } catch (error) {
        console.log(error.message);
        res.status(error.status).json({
            message:error.message
        })
    }
}

module.exports = adminAuth
