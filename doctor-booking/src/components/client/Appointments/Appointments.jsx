import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";

function Appointments({ appointments }) {
  const navigate = useNavigate();

  const {show} = useContext(ToastifyContest) 

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

  const handleStartMeeting = (starting, ending, id) => {
    const timeNow = moment();
    if (timeNow.isBefore(moment(starting))) show("You can join only at the given time",303);
    else if (timeNow.isAfter(moment(ending))) ToastifyContest("Your time ended",303);
    else navigate(`/meet/${id}`);
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
                <div className="w-[50%] ml-2 flex items-center h-full">
                  <p>
                    Dr .
                    {firstLetterUpperCase(appointment?.doctorId?.firstName) +
                      " " +
                      firstLetterUpperCase(appointment?.doctorId?.lastName)}
                  </p>
                </div>
              </div>
              <div>
                <p>{formateDate(appointment.date)}</p>
              </div>
              {/* <div>
                <p>
                  {firstLetterUpperCase(appointment?.doctorId?.firstName) +
                    " " +
                    firstLetterUpperCase(appointment?.doctorId?.lastName)}
                </p>
              </div> */}
              <div>
                <div className="flex ">
                  <p>Starting Time :</p>
                  <p>{formatTime(appointment?.startingTime)}</p>
                </div>
                <div className="flex ">
                  <p>Ending Time :</p>
                  <p>{formatTime(appointment?.endingTime)}</p>
                </div>
              </div>
              <div>
                <button
                  className="bg-slate-800 text-white p-2 rounded-md w-32"
                  onClick={() =>
                    handleStartMeeting(
                      appointment?.startingTime,
                      appointment?.doctorId?.lastName,
                      appointment._id
                    )
                  }
                  // navigate(`/meet/${appointment._id}`)}}>
                >
                  Join Room
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Appointments;
