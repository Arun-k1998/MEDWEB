import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";
import api from "../../../helper/axios/userAxios";

function Appointments({
  appointments,
  setAppointmentsType,
  setPresView,
  handlePrescriptionButton,
}) {
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

  const handleStartMeeting = (starting, ending, id) => {
    const timeNow = moment();
    if (timeNow.isBefore(moment(starting))) {
      show("You can join only at the given time", 303);
    } else if (timeNow.isAfter(moment(ending))) {
      show("Your time ended", 303);
    } else navigate(`/meet/${id}`);
  };

  const timChecker = (endingTime) => {
    const timeNow = moment();
    return timeNow.isAfter(moment(endingTime));
  };

  const buttons = [
    {
      name: "Upcoming...",
      value: "upcoming",
      active: true,
    },
    {
      name: "Consulted",
      value: "consulted",
      active: false,
    },
  ];
  const [buttonNames, setButtonsNames] = useState(buttons);

  const handleButtonClick = (index) => {
    let newButton = buttonNames.map((button, index1) => {
      return {
        ...button,
        active: index == index1,
      };
    });
    setButtonsNames(newButton);

    console.log(buttonNames[index]["value"]);
    setAppointmentsType(buttonNames[index]["value"]);
  };

  const handleCancellation = (id) => {
    alert(id);
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
      <div className="w-[95%] mx-auto  my-5 gap-6 flex">
        {buttonNames.map((button, index) => {
          return (
            <button
              className={`${
                button.active ? "bg-slate-500 text-white" : "bg-slate-300"
              } p-2 rounded-lg`}
              onClick={() => handleButtonClick(index)}
            >
              {button.name}
            </button>
          );
        })}
        {/* <button className="p-2 bg-slate-300 rounded-lg">Upcoming</button>
        <button className="p-2 bg-slate-300 rounded-lg">Consulted</button> */}
      </div>
      <div className="w-[95%] h-[85%] mx-auto overflow-y-scroll  ">
        {appointments?.map((appointment, index) => {
          return (
            <div
              className={`${
                timChecker(appointment?.endingTime)
                  ? 'bg-slate-500'
                  : 'bg-slate-600'
              } flex items-center justify-evenly gap-2 w-full h-40 mb-2 text-white`}
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
                <div className="w-[50%] ml-2 flex flex-col justify-around items-center h-full">
                  <p>
                    Dr .
                    {firstLetterUpperCase(appointment?.doctorId?.firstName) +
                      " " +
                      firstLetterUpperCase(appointment?.doctorId?.lastName)}
                  </p>
                  {appointment.status === "finish" ? (
                    <div className="w-full flex  justify-center gap-3 items-center">
                      <div className="w-2 h-2 rounded-full bg-lime-700"></div>
                      <p>Consulted</p>
                    </div>
                  ) : (
                    ""
                  )}
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
              <div className="flex  gap-2">
                {appointment.status === "finish" ? (
                  <div className="w-50  h-full flex gap-3 items-center">
                    <button
                      className="bg-slate-800 hover:bg-slate-950 text-white p-2 rounded-md w-32"
                      onClick={() =>
                        handlePrescriptionButton(appointment._id, index)
                      }
                    >
                      Prescripton
                    </button>
                  </div>
                ) : (
                  <div
                    className={`${
                      timChecker(appointment?.endingTime)
                        ? "pointer-events-none"
                        : ""
                    } flex flex-col gap-3 `}
                  >
                    {timChecker(appointment?.endingTime) ? (
                      <p className="text-white font-bold ">
                        You Missed the consultation
                      </p>
                    ) : (
                      <>
                        <div className="flex gap-3">
                          <button
                            className="bg-slate-800 hover:bg-slate-950 text-white p-2 rounded-md w-32"
                            onClick={() =>
                              handleStartMeeting(
                                appointment?.startingTime,
                                appointment?.endingTime,
                                appointment?._id
                              )
                            }
                            // navigate(`/meet/${appointment._id}`)}}>
                          >
                            Join Room
                          </button>
                          <button
                            className="bg-slate-800 hover:bg-slate-950 text-white p-2 rounded-md w-32"
                            onClick={() => handleCancellation(appointment._id)}
                          >
                            Cancel
                          </button>
                        </div>
                        <div>
                          <button
                            className="bg-slate-800 hover:bg-slate-950 text-white p-2 rounded-md w-[16.75rem]"
                            onClick={() =>
                              navigate(
                                `/consult/detail/${appointment?.doctorId?._id}?reschedule=${appointment._id}`
                              )
                            }
                          >
                            ReSchedule
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Appointments;
