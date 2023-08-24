const timeSchedule = require('../model/doctorTimeSlotModel')

const timeSlotes = async(req,res)=>{
    try {
        const {id} = req.params
        const timeSlotes = await timeSchedule.find({doctorId:'64aec98ff79d0a03023e88a5'})
        if(timeSlotes){
            res.status(200).json({
                message:timeSlotes
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(error.status).json({
            message:error.message
        })
    }
}



module.exports = {
    timeSlotes
}