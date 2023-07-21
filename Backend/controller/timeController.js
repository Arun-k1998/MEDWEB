const timeSchedule = require('../model/doctorTimeSlotModel')

const timeSlotes = async(req,res)=>{
    try {
        const {id} = req.params
        console.log(id);
        const timeSlotes = await timeSchedule.find({doctorId:'64aec98ff79d0a03023e88a5'})
        if(timeSlotes){
            res.status(200).json({
                message:timeSlotes
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(404).json({
            message:error.message
        })
    }
}



module.exports = {
    timeSlotes
}