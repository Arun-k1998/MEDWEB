const jwt = require("jsonwebtoken");

const adminAuth = async(req,res,next)=>{
    try {
        const authorization = req.headers['authorization']
        if(!authorization) throw new Error('Authorization failed')
        const token = authorization.replace('Bearer ',"")
        const verification = jwt.verify(token,'adminSecrectKey123')
        if(!verification) throw new Error('Token failed')
        next()
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = adminAuth
