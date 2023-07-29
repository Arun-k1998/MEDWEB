import React, { useEffect, useState } from "react";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { useSelector } from "react-redux";
import moment from "moment";
function ConsultationListing() {
  const [consultationList, setConsultationList] = useState([]);

  const doctorId = useSelector((store) => store.doctor.id);
 
  const formatTime = (timee) => {
    let time = moment(timee).format("LT");
    return time;
  };

  const formateDay = (date)=>{
    let day = moment(date).format('dddd')
    return day
  }

  const formateDate = (date) => {
    let result = moment(date).format("LL");
    return result;
  };
  useEffect(() => {
    doctorApi.get(`/appointments/${doctorId}`).then((response) => {
      if (response.data.status) {
        setConsultationList([...response.data.conslutationList]);
      }
    });
  }, []);
  return (
    <div className="w-full bg-slate-400 h-full ">
      <div className=" my-10 mx-auto w-[90%] px-[10%] h-[100%] bg-black ">
        <div className="w-full h-full overflow-y-scroll">
          {consultationList.length ? (
            consultationList.map((obj) => {
              return (
                <div className="w-full my-6 h-40 flex  bg-slate-400 shadow-2xl">
                  <div className="w-[33.66%] h-full bg-orange-400">
                    <div className="w-full h-full flex flex-col justify-center items-center">
                      <p className="underline underline-offset-4 ">Patient </p>
                      <p>{`${obj.userId.firstName} ${obj.userId.lastName} `}</p>
                    </div>
                  </div>
                  <div className="w-[33.66%]  h-full bg-red-500 ">
                    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
                      <div className="flex gap-3">
                        <p>{formateDate(obj.date)}</p>
                        <p>{formateDay(obj.date)}</p>
                      </div>
                      <div>
                        <p>
                          Staring Time :{" "}
                          <span>{formatTime(obj.startingTime)}</span>
                        </p>
                        <p>
                          Ending Time :{" "}
                          <span>{formatTime(obj.endingTime)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-[33.6%] h-full bg-lime-600 ">
                    <div className="w-full h-full flex gap-3 justify-center items-center ">
                      <button className="bg-white p-2 rounded-s-2xl hover:bg-slate-600 hover:text-white">
                        Start
                      </button>
                      <button className="bg-white p-2 rounded-e-2xl">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>hello</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultationListing;
