import React, { useContext, useEffect, useState } from "react";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";
function ConsultationListing() {
  const [consultationList, setConsultationList] = useState([]);
  const navigate = useNavigate();
  const doctorId = useSelector((store) => store.doctor.id);
  const { show } = useContext(ToastifyContest);
  const [cancel,setCancel] = useState(false)

  const formatTime = (timee) => {
    let time = moment(timee).format("LT");
    return time;
  };

  const formateDay = (date) => {
    let day = moment(date).format("dddd");
    return day;
  };

  const formateDate = (date) => {
    let result = moment(date).format("LL");
    return result;
  };

  const handleFinish = (consultationId) => {
    doctorApi.post(`/consultation_finish/${consultationId}`).then((res) => {
      if (res.data.status) {
        alert('success');
        show(res.data.message);
      }
    }).catch((error)=>{
      console.log('error');
      show(error.response.data.message,400)
    })
  };
  // const handleStartMeeting = (starting, ending, id) => {
  //   const timeNow = moment();
  //   if (timeNow.isBefore(moment(starting)))
  //     alert("You can join only at the given time");
  //   else if (timeNow.isAfter(moment(ending))) alert("Your time ended");
  //   else navigate(`/meet/${id}`);
  // };

  const handleCancellation =(consultationId)=>{
    doctorApi.patch('/cancelConsultation',{cId:consultationId}).then((response)=>{
      if(response.data.status){
        show(response.data.message)
        setCancel(pre=>!pre)
      }
    }).catch((error) => {
      if (error.response) {
        show(error.response.data.message, error.response.status);
      } else if (error.request) {
        navigate("/500");
      } else {
        console.log(error);
      }
    });
  }

  const handleStart = (consultaionId)=>{
    navigate(`/doctor/meet/${consultaionId}`)
    const url = `http://localhost:5173/doctor/prescription/${consultaionId}`
    window.open(url, '_blank');
  }

  useEffect(() => {
    doctorApi.get(`/appointments/${doctorId}`).then((response) => {
      if (response.data.status) {
        setConsultationList([...response.data.conslutationList]);
      }
    });
  }, [cancel]);
  return (
    <div className="w-full bg-slate-100 h-[88vh] ">
      <div className="w-full flex justify-center text-lg ">
        <p className="underline underline-offset-8">Appointments</p>
      </div>
      {/* <div className="flex gap-4 mx-auto w-[90%]">
        <button className="text-white bg-zinc-600 p-2">Upcoming</button>
        <button className="text-white bg-zinc-600 p-2">Consulted</button>
      </div> */}
      <div className=" my-10 mx-auto w-[90%] px-[10%] h-[90%] overflow-y-scroll bg-white  ">
        <div className="w-full h-full ">
          {consultationList?.length ? (
            consultationList?.map((obj) => {
              return (
                <div className="w-full my-6 h-40 flex  bg-slate-300 shadow-slate-400  shadow-2xl">
                  <div className="w-[33.66%] h-full ">
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <p className="underline underline-offset-4 ">Patient </p>
                      <p>{`${obj.userId?.firstName} ${obj?.userId?.lastName} `}</p>
                    </div>
                  </div>
                  <div className="w-[33.66%]  h-full ">
                    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
                      <div className="flex gap-3">
                        <p>{formateDate(obj?.date)}</p>
                        <p>{formateDay(obj?.date)}</p>
                      </div>
                      <div>
                        <p>
                          Staring Time :{" "}
                          <span>{formatTime(obj?.startingTime)}</span>
                        </p>
                        <p>
                          Ending Time :{" "}
                          <span>{formatTime(obj?.endingTime)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-[33.6%] flex flex-col justify-around h-full  ">
                    <div className="w-full h-1/2 flex gap-3 justify-center items-center ">
                      <button
                        className="bg-white p-2 rounded-s-2xl hover:bg-slate-600 hover:text-white"
                        onClick={() => handleStart(obj._id)}
                      >
                        Start
                      </button>
                      <button className="bg-white p-2 rounded-e-2xl" onClick={()=>handleCancellation(obj._id)} >
                        Cancel
                      </button>
                    </div>
                    <div className="w-full h-1/2 flex gap-3 justify-center items-center">
                      <button
                        className="bg-white p-2 w-32 hover:shadow-inner hover:shadow-red-600  rounded-2xl"
                        onClick={() => handleFinish(obj._id)}
                      >
                        Finish
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="w-full flex justify-center h-full items-center">
              <p>No consultation Found ....</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultationListing;
