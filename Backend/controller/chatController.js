const chatModel = require("../model/chatModel");
const doctorModel = require("../model/doctorModel");
const userModel = require('../model/useModel')
const createChat = async (req, res) => {
  console.log(req.body);
  const newChat = new chatModel({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.json({
      message: error.message,
    });
  }
};

const userChats = async (req, res) => {
  try {
    console.log(req.params.userId, "req.params.userId");
    const chat = await chatModel.find({
      members: { $in: [req.params.userId] },
    });
    console.log(chat);
    res.json(chat);
  } catch (error) {
    console.log(error.message);
    res.json({
      message: error.message,
    });
  }
};

const findChat = async (req, res) => {
  try {
    const chat = await chatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error.message);
    res.json({
      message: error.message,
    });
  }
};

const doctorDetails = async (req, res) => {
  const { doctorId } = req.params;
  console.log(doctorId);
  try {
    const doctorDetails = await doctorModel.findById(doctorId, { password: 0 });
    res.json(doctorDetails);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

const userDetails = async (req, res) => {
  const {  userId } = req.params;
  console.log( userId);
  try {
    const doctorDetails = await userModel.findById( userId, { password: 0 });
    console.log(doctorDetails);
    res.json(doctorDetails);
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

module.exports = {
  createChat,
  findChat,
  userChats,
  doctorDetails,
  userDetails
};
