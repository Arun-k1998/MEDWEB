import React, { Fragment, useContext, useState } from "react";
import moment from "moment";
import { GrClose } from "react-icons/gr";
import DeleteButton from "../../../container/deleteButton/DeleteButton";
import DatePicker from "react-datepicker";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";
function ScheduledTimes({ scheduledDates, setRefresh }) {
  const [schedulePopup, setSchedulePopUp] = useState(false);
  const [editScheduledTime, setEditScheduledTime] = useState({});
  const [date, setDate] = useState({});
  const [today, setToday] = useState(moment().add(1, "days"));

  const { show } = useContext(ToastifyContest);

  function isISODate(input) {
    return moment(input, moment.ISO_8601, true).isValid();
  }

  const formatTime = (timee) => {
    let time = moment(timee).format("LT");
    // console.log(time);
    return time;
  };

  const formattedTime = (timeValue) => {
    console.log("dd " + timeValue);
    const isValidISODate = isISODate(timeValue);
    console.log(isValidISODate);
    if (isValidISODate) {
      console.log("dd " + timeValue);
      const parsedTime = moment(timeValue); // Parse the ISO timestamp
      const formattedTime = parsedTime.format("hh:mm A");
      console.log("formattedTime", formattedTime);
      return formattedTime.slice(0, 5);
    } else {
      console.log("ddsdsdsdsdsd " + timeValue);
      const time = moment(timeValue, "HH:mm").format("hh:mm A");
      console.log("time " + time);
      return time.slice(0, 5);
    }
  };

  const formateDay = (date) => {
    let day = moment(date).format("dddd");
    return day;
  };

  const formateDate = (date) => {
    let result = moment(date).format("LL");
    return result;
  };

  const handleEdit = (index) => {
    setEditScheduledTime({ ...scheduledDates[index] });
    setSchedulePopUp((prev) => !prev);
  };

  const addmore = () => {
    let sessions = date.sessions;
    let sloteLength = sessions.length + 1;
    setDate((prev) => {
      return {
        ...prev,
        ["sessions"]: [
          ...prev.sessions,
          { startingTime: null, endingTime: null, session: sloteLength },
        ],
      };
    });
  };

  const handleTime = (e, index) => {
    // alert("hi");
    // alert(index)
    const { name, value } = e.target;
    // alert(name)
    const selectedDate = date.date;
    const combinedDate = selectedDate + " " + value;

    const selectedTime = moment(value).format("LT");
    const convert = moment(combinedDate, "YYYY-MM-DD HH:mm").toDate();
    // console.log(convert, "---p");
    // console.log(convert)
    const convertedDate = moment(convert).format("LT"); // Modify the format as per your needs

    // console.log("new "+convertedDate)
    // console.log("times");
    // console.log(convert);
    // console.log(selectedTime)

    const timeChange = { ...date };
    // console.log(timeChange);
    let newarray = timeChange.sessions;
    // console.log("index " + index);
    timeChange.sessions[index][name] = convert;
    // alert(convert)
    if (name === "startingTime") {
      for (let i = 0; i < index; i++) {
        if (
          convert >= moment(newarray[i].startingTime).toDate() &&
          convert <= moment(newarray[i].endingTime).toDate()
        ) {
          alert("already selected");
          timeChange.sessions[index][name] = null;
        } else {
          console.log("hereeeeee");
          timeChange.sessions[index][name] = convert;

          setDate({ ...timeChange });
        }
      }
    } else if (name === "endingTime") {
      for (let i = 0; i < index; i++) {
        console.log(newarray[index].startingTime);
        console.log(moment(newarray[i].startingTime).toDate());
        console.log(moment(newarray[i].endingTime).toDate());
        console.log(convert);
        if (
          (convert >= moment(newarray[i].startingTime).toDate() &&
            convert <= moment(newarray[i].endingTime).toDate()) ||
          (newarray[index].startingTime <
            moment(newarray[i].startingTime).toDate() &&
            moment(newarray[i].endingTime).toDate() < convert)
        ) {
          alert("already selected");
          alert("endingTime");
          timeChange.sessions[index][name] = null;
        } else {
          console.log("here");
          timeChange.sessions[index][name] = convert;
          setDate({ ...timeChange });
        }
      }
    }
    const starting = date.sessions[index].startingTime;

    const ending = date.sessions[index].endingTime;

    // if((starting || ending) && (||ending.isBefore(starting) )) alert('select a valid time')
    if (ending && moment(starting).isAfter(ending)) {
      return alert("select valid time format");
    }
    if (starting && moment(ending).isBefore(starting)) {
      return alert("hi");
    }

    if (date.sessions[index].startingTime && date.sessions[index].endingTime) {
      let count = 0;
      let starter = new Date(date.sessions[index].startingTime).getTime();
      let ender = new Date(date.sessions[index].endingTime).getTime();
      console.log("statrer", starter);
      console.log("ender", ender);
      
      for (let i = starter; i < ender; i = starter) {
        starter += date.duration * 60 * 1000;
        count++;
      }
      
      // datee.sessions[index].token = count
      setDate((pre) => {
        return {
          ...pre,
          ["sessions"]: pre["sessions"].map((ele, num) => {
            if (num === index) {
              console.log("elee", ele);
              return { ...ele, ["totalTokens"]: count };
            } else return { ...ele };
          }),
        };
      });
    }
  };

  const handleDelete = (index, dateId, sessionId) => {
    doctorApi
      .post("/deleteSession", { id: dateId, slotId: sessionId })
      .then((res) => {
        if (res.data.status) {
          show(res.data.message);
          setSchedulePopUp((pre) => !pre);
        }
      });
  };

  const handleSave = (sessionId, index) => {
    const sessionDetails = date.sessions[index];
    console.log(sessionDetails);

    doctorApi
      .patch("/updateSlot", {
        startingTime: sessionDetails.startingTime,
        endingTime: sessionDetails.endingTime,
        scheduleId: date._id,
        index,
        duration: date.duration,
      })
      .then((res) => {
        if (res.data.status) {
          show(res.data.message);
          setSchedulePopUp((prev) => !prev);
        }
      })
      .catch((error) => {
        if (error.response) {
          show(error.response.data.message, error.response.status);
        } else if (error.request) {
          navigate("/500");
        } else {
          console.log(error);
        }
      });
  };

  const handleDateDelete = (scheduleId) => {
    // const addedDate = moment(date).add(3, 'days')
    // alert(addedDate)
    doctorApi.post("/deleteDate", { dateId: scheduleId }).then((res) => {
      if (res.data.status) {
        show(res.data.message);
      }
    });
  };

  const handlRemove = (schedulId) => {
    doctorApi.put(`/cancel_view_shcedul?id=${schedulId}`).then((res) => {
      if (res.data.status) {
        setRefresh((pre) => !pre);
      }
    });
  };

  return (
    <div className="w-[90%] h-full mx-auto  py-10  ">
      {!schedulePopup && (
        <table className="w-full max-h-14 text-sm text-left text-gray-500 dark:text-gray-400 shadow-xl ">
          <thead className="text-xs text-gray-700 uppercase bg-[#05445E] dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                SI No
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Duration
              </th>
              <th scope="col" className="px-6 py-3">
                Sessions
              </th>

              <th scope="col" className="px-6 py-3">
                Starting Time
              </th>
              <th scope="col" className="px-6 py-3">
                Ending Time
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scheduledDates.map((schedule, index) => {
              return (
                <React.Fragment key={index}>
                  <tr
                    className="bg-white border-b bg-[#a0d6db] dark:border-gray-700 "
                    key={index}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{formateDate(schedule?.date)}</td>
                    <td className="px-6 py-4">{schedule?.duration}</td>

                    <td className="px-6 py-4 flex flex-col">
                      {schedule?.sessions?.map((session, index1) => {
                        return (
                          <>
                            <p>{session?.session}</p>
                            <hr className="w-full" />
                          </>
                        );
                      })}
                    </td>

                    <td className="px-6 py-4 cursor-pointer gap-3">
                      {schedule?.sessions?.map((session, index2) => {
                        return (
                          <>
                            <p className="">
                              {formatTime(session?.startingTime)}
                            </p>
                            <hr className="w-full" />
                          </>
                        );
                      })}
                    </td>
                    <td className="px-6 py-4 cursor-pointer ">
                      {schedule?.sessions?.map((session, index3) => {
                        return (
                          <>
                            <p>{formatTime(session?.endingTime)}</p>
                            <hr className="w-full" />
                          </>
                        );
                      })}
                    </td>
                    <td className="flex gap-2">
                      {today < moment(schedule.date) ? (
                        <button
                          className="p-2 bg-black text-white w-28 hover:shadow-xl hover:shadow-red-400 rounded-lg"
                          onClick={() => {
                            handleEdit(index);
                            setDate({ ...schedule });
                          }}
                        >
                          Edit
                        </button>
                      ) : (
                        <button className="p-2  w-28 hover:shadow-xl hover:shadow-red-400 rounded-lg">Can't edit</button>
                      )}
                      {today <= moment(schedule.date) ? (
                        <button
                          className="p-2 bg-black text-white w-28 hover:shadow-xl hover:shadow-red-400 rounded-lg"
                          onClick={() => {
                            handleDateDelete(schedule._id);
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          className="p-2 bg-red-400 text-white w-28 hover:shadow-xl hover:shadow-red-400 rounded-lg"
                          onClick={() => handlRemove(schedule._id)}
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
      {schedulePopup && (
        <div className=" flex flex-col bg-white absolute top-20 w-4/5 py-10 px-10 rounded-xl shadow-2xl">
          <p
            className="absolute  top-5 right-10 cursor-pointer hover:bg-red-800 rounded-full p-2 "
            onClick={() => setSchedulePopUp(false)}
          >
            <GrClose />
          </p>
          <div className="my-3 ">
            <h2 className="mb-2">Add Time Slotes</h2>
            <hr />
          </div>
          <div>
            <select name="" id=""></select>
          </div>

          {date.sessions.map((slot, index) => (
            <Fragment key={index}>
              <div className="w-full bg-emerald-400 flex justify-between text-white">
                <p> Slote NO:{slot.session}</p>
              </div>

              <div
                key={index}
                className="mb-2 flex justify-evenly w-full gap-4 "
              >
                <div className="flex flex-col my-3 w-1/5">
                  <label htmlFor="">Starting time : </label>

                  <input
                    type="time"
                    name="startingTime"
                    value={formattedTime(slot?.startingTime)}
                    onChange={(e) => handleTime(e, index)}
                    className="p-1 text-center  bg-slate-500 w-full"
                  />
                </div>
                <div className="flex flex-col my-3 w-1/5">
                  <label htmlFor="">Ending Time</label>
                  <input
                    type="time"
                    name="endingTime"
                    value={formattedTime(slot?.endingTime)}
                    onChange={(e) => handleTime(e, index)}
                    className="p-1 text-center  bg-slate-500 w-full"
                  />
                </div>
                <div className="flex flex-col my-3 w-1/5">
                  <p>No of Tokens</p>
                  <input
                    type="text"
                    value={slot?.totalTokens}
                    className="p-1 text-center  bg-slate-200 w-full"
                    disabled
                  />
                </div>
                <div className="flex flex-col items-center justify-center my-3 w-1/5">
                  <DeleteButton
                    sessionId={slot._id}
                    id={date._id}
                    index={index}
                    clicking={handleDelete}
                  />
                </div>
                <div className="flex flex-col  w-1/5  my-3 pt-4 justify-center items-center">
                  <button
                    className="bg-green-400 text-white p-2 rounded-lg hover:shadow-lg hover:shadow-green-800 w-36"
                    onClick={() => handleSave(slot._id, index)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </Fragment>
          ))}
          <div className="w-full flex justify-start">
            <button
              className="p-2 text-white rounded-lg bg-slate-400 mb-2"
              onClick={addmore}
            >
              Add More
            </button>
          </div>
          {/* <div className="flex justify-center">
            <button
              className="w-1/4 bg-green-700  text-white p-2 rounded-lg"
              // onClick={handleSubmit}
            >
              Submit
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}

export default ScheduledTimes;
