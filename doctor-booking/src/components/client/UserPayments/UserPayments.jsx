import moment from "moment";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";
import api from "../../../helper/axios/userAxios";
import { BsCurrencyRupee } from "react-icons/bs";

function UserPayments({ appointments }) {
  const navigate = useNavigate();

  const { show } = useContext(ToastifyContest);

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

  const firstLetterUpperCase = (str) => {
    if (str) return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleCancellation = (id) => {
    alert('hi')
    api.post(`/cancel_appointment/${id}`).then((res) => {
      if (res.data.status) {
        show(res.data.message);
        
      }
    });
  };

  return (
    <div className="w-[80%] h-full mx-auto bg-slate-400 py-10  ">
      <div className="w-full flex justify-center mb-4 underline underline-offset-8 text-xl">
        <h2>Your Appointments</h2>
      </div>
      <div className="w-[95%] h-full mx-auto overflow-y-scroll  ">
        {appointments?.map((appointment, index) => {
          return (
            <div
              className="flex  items-center justify-evenly gap-2 w-full h-40  bg-slate-600 mb-2  text-white "
              key={index}
            >
              <div className="w-[30%] p-2 h-full flex ">
                <div className="w-[50%] h-full">
                  <img
                    src={`${import.meta.env.VITE_SERVER_URL}/images/${
                      appointment?.doctorId?.image
                    }`}
                    className="overflow-hidden h-full w-full object-cover"
                    alt=""
                  />
                </div>
                <div className="w-[50%] ml-2 flex flex-col justify-center items-center h-full">
                  <p>
                    Dr .
                    {firstLetterUpperCase(appointment?.doctorId?.firstName) +
                      " " +
                      firstLetterUpperCase(appointment?.doctorId?.lastName)}
                  </p>
                  <div className="flex flex-col justify-between">
                    <span>Consultation Fee
                      <div className="flex justify-center items-center">
                    <p>{appointment?.doctorId?.feePerConsultation}</p>

                      <span><BsCurrencyRupee /></span>
                      </div>

                    </span>
                  </div>
                </div>
              </div>
              <div className=" w-[30%] flex flex-col justify-center items-center">
                <div className="flex gap-2">
                  <p>Booked Date</p>
                  <p>
                    {" "}
                    <p>
                      {appointment?.createdAt &&
                        formateDate(appointment?.createdAt)}
                    </p>
                  </p>
                </div>
                <div className="flex gap-3">
                  <p>Consultation date</p>
                  <p>{formateDate(appointment.date)}</p>
                </div>
              </div>
              {/* <div>
                <p>
                  {firstLetterUpperCase(appointment?.doctorId?.firstName) +
                    " " +
                    firstLetterUpperCase(appointment?.doctorId?.lastName)}
                </p>
              </div> */}
              <div className="w-[20%]">
                <div className="flex ">
                  <p>Starting Time :</p>
                  <p>{formatTime(appointment?.startingTime)}</p>
                </div>
                <div className="flex ">
                  <p>Ending Time :</p>
                  <p>{formatTime(appointment?.endingTime)}</p>
                </div>
              </div>
              <div className=" w-[20%] flex flex-col gap-2">
                <button
                  className="bg-slate-800 hover:bg-slate-950 text-white p-2 rounded-md w-32"
                  onClick={() => handleCancellation(appointment._id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserPayments;
