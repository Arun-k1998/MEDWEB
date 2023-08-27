const jwt = require("jsonwebtoken");
const users = require("../model/useModel");
async function userAuth(req, res, next) {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization) {
      const error =  new Error("user Authorization header required");
      error.status = 404
      throw error
    }
    const token = authorization.replace("Bearer ", "");
    const verify = jwt.verify(token, process.env.JSON_SECRET_KEY);
    const user = await users.findById(verify.id);
    if (!user) {
      const error = new Error("User not found");
      error.status = 401;
      throw error;
    }
    if (user.is_Blocked) {
      let error = new Error("Your Account Blocked");
      error.status = 401;
      error.block = true;      
      throw error;
    }
    req.user = {
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      notifications: user.notifications,
      wallet: user.wallet,
    };
    next();
  } catch (error) {
    console.log(error.message);
    res
      .status(error.status)
      .json({ message: error.message, block: error?.block || false });
  }
}

module.exports = userAuth;
