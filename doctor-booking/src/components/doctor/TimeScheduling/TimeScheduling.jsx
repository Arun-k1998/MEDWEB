import moment from "moment/moment";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { useSelector } from "react-redux";
import { GrClose } from "react-icons/gr";
import DeleteButton from "../../../container/deleteButton/DeleteButton";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";
import { data } from "autoprefixer";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function TimeScheduling() {
  const { id } = useSelector((store) => store.doctor);
  const duration = [10, 15, 20];
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const [active, setActive] = useState({
    date: moment(),
    label: moment().format("dddd"),
  });
  const [datee, setDatee] = useState({
    date: "",
    datePicker: moment().toDate(),
    duration: 10,
    sessions: [
      { startingTime: null, endingTime: null, session: 1, totalTokens: 0 },
    ],
  });
  const [date, setDate] = useState("");
  const [existingTime, setExistingTime] = useState(false);
  const [timeSlotes, setTimeSlots] = useState([]);
  const [schedulePopup, setSchedulePopup] = useState(false);
  const { show } = useContext(ToastifyContest);
  const navigate = useNavigate();
  const [excluedDate, setExcludeDate] = useState([]);
  const [created, setCreated] = useState(false);

  const timeConvertion = (time) => {
    const convertedDate = moment(time, "HH:mm").format("LT");
    return convertedDate;
  };

  // const handleDate = (e) => {
  //   const { name, value } = e.target;
  //   alert(value)
  //   console.log(name, value);
  //   console.log(id);
  //   let today = moment().format("ll");
  //   let currentDate = moment(value);
  //   if (currentDate.isAfter(today)) console.log("after today");

  //   let formatedDate = currentDate.format("ll");
  //   if (currentDate.isBefore(today)) {
  //     return alert("Select a Valid day");
  //   }
  //   console.log("current ", currentDate);

  //   let previous = timeSlotes.filter((obj) => {
  //     console.log(moment(obj.date).format("ll"));
  //     return formatedDate === moment(obj.date).format("ll");
  //   });

  //   if (previous.length > 0) {
  //     setExistingTime((prev) => !prev);
  //     console.log(previous[0]);

  //     setDatee({
  //       ...previous[0],
  //       [name]: previous[0].date.slice(0, 10),
  //       ["sessions"]: previous[0].sessions.map((obj) => {
  //         return {
  //           ...obj,
  //           ["startingTime"]: moment(
  //             obj.startingTime,
  //             "YYYY-MM-DDTHH:mm:ss.SSSZ"
  //           ).toDate(),
  //           ["endingTime"]: moment(
  //             obj.endingTime,
  //             "YYYY-MM-DDTHH:mm:ss.SSSZ"
  //           ).toDate(),
  //         };
  //       }),
  //     });
  //   } else {
  //     setDatee((prev) => ({
  //       ...prev,
  //       date: value,
  //       sessions: [{ startingTime: null, endingTime: null, session: 1 }],
  //     }));
  //   }
  //   setSchedulePopup(true);
  //   // doctorApi.get(`/timeSlotes?id=${id}&date=${value}`).then((response) => {
  //   //   console.log(response.data.slotes);
  //   //   if (response.data.slotes) {
  //   //     setExistingTime({ ...response.data.slotes });
  //   //   } else {
  //   //     setDatee((date) => {
  //   //       return { ...date, [name]: value };
  //   //     });
  //   //   }
  //   // });
  // };

  const handleDate = (e) => {
    // const { name, value } = e.target;
    const value = e;
    // alert(moment(value).format('YYYY-MM-DD'))
    let name = "date";
    console.log(name, value);
    console.log(id);
    let today = moment().format("ll");
    let currentDate = moment(value);
    if (currentDate.isAfter(today)) console.log("after today");

    let formatedDate = currentDate.format("ll");
    if (currentDate.isBefore(today)) {
      return alert("Select a Valid day");
    }
    console.log("current ", currentDate);

    let previous = timeSlotes.filter((obj) => {
      console.log(moment(obj.date).format("ll"));
      return formatedDate === moment(obj.date).format("ll");
    });

    if (previous.length > 0) {
      setExistingTime((prev) => !prev);
      console.log(previous[0]);

      setDatee({
        ...previous[0],
        [name]: moment(value).format("YYYY-MM-DD"),
        ["sessions"]: previous[0].sessions.map((obj) => {
          return {
            ...obj,
            ["startingTime"]: moment(
              obj.startingTime,
              "YYYY-MM-DDTHH:mm:ss.SSSZ"
            ).toDate(),
            ["endingTime"]: moment(
              obj.endingTime,
              "YYYY-MM-DDTHH:mm:ss.SSSZ"
            ).toDate(),
          };
        }),
      });
     
    } else {
      console.log(datee);
      setDatee((prev) => ({
        ...prev,
        date: moment(value).format("YYYY-MM-DD"),
        datePicker: moment(value).toDate(),
        sessions: [{ startingTime: null, endingTime: null, session: 1 }],
      }));
      
    }
    setSchedulePopup(true);
    // doctorApi.get(`/timeSlotes?id=${id}&date=${value}`).then((response) => {
    //   console.log(response.data.slotes);
    //   if (response.data.slotes) {
    //     setExistingTime({ ...response.data.slotes });
    //   } else {
    //     setDatee((date) => {
    //       return { ...date, [name]: value };
    //     });
    //   }
    // });
  };

  const handleTime = (e, index) => {
    const { name, value } = e.target;
    const { date } = datee;

    const timeNow = moment();

    const combinedDate = date + " " + value;

    const selectedTime = moment(value).format("LT");
    const convert = moment(combinedDate, "YYYY-MM-DD HH:mm").toDate();
    console.log(convert);
    if (timeNow > convert) {
      return alert("select a time as valid");
    }
    // console.log(convert)
    const convertedDate = moment(convert).format("LT"); // Modify the format as per your needs

    // console.log("new "+convertedDate)
    console.log("times");
    console.log(convert);
    // console.log(selectedTime)

    const timeChange = { ...datee };
    // console.log(timeChange);
    let newarray = timeChange.sessions;
    // console.log("index " + index);
    timeChange.sessions[index][name] = convert;
    if (name === "startingTime") {
      for (let i = 0; i < index; i++) {
        if (
          convert >= newarray[i].startingTime &&
          convert <= newarray[i].endingTime
        ) {
          alert("already selected");
          timeChange.sessions[index][name] = null;
        } else {
          console.log("hereeeeee");
          timeChange.sessions[index][name] = convert;

          // setDatee({ ...timeChange });
        }
      }
    } else if (name === "endingTime") {
      for (let i = 0; i < index; i++) {
        if (
          convert >= newarray[i].startingTime &&
          convert <= newarray[i].endingTime
        ) {
          alert("already selected");
          timeChange.sessions[index][name] = null;
        } else {
          console.log("here");
          timeChange.sessions[index][name] = convert;
          // setDatee({ ...timeChange });
        }
      }
    }
    const starting = datee.sessions[index].startingTime;
    const ending = datee.sessions[index].endingTime;
    // if((starting || ending) && (||ending.isBefore(starting) )) alert('select a valid time')
    if (ending && moment(starting).isAfter(ending)) {

      return alert("Starting date should less than ending Date");

    }
    if (starting && moment(ending).isBefore(starting)) {
      return alert("hi");
    }

    setDatee({ ...timeChange });

    if (
      datee.sessions[index].startingTime &&
      datee.sessions[index].endingTime
    ) {
      let count = 0;
      let starter = new Date(datee.sessions[index].startingTime).getTime();
      let ender = new Date(datee.sessions[index].endingTime).getTime();

      for (let i = starter; i < ender; i = starter) {
        starter += datee.duration * 60 * 1000;
        count++;
      }
      // datee.sessions[index].token = count
      setDatee((pre) => {
        return {
          ...pre,
          ["sessions"]: pre["sessions"].map((ele, num) => {
            if (num === index) {
              return { ...ele, ["totalTokens"]: count };
            } else return { ...ele };
          }),
        };
      });
    }
  };

  // const handleTime = (value, name, index) => {
  //   // alert(value)
  //   // const { name, value } = e.target;
  //   const { date } = datee;

  //   const timeNows = moment().format("LLL");
  //   const timeNow = moment(timeNows).toDate();
  //   const combinedDate = date + " " + moment(value).format("LT");

  //   const selectedTime = moment(value).format("LT");
  //   const convert = moment(combinedDate, "YYYY-MM-DD HH:mm ").toDate();

  //   // console.log(convert)
  //   const convertedDate = moment(convert).format("LT"); // Modify the format as per your needs

  //   // console.log("new "+convertedDate)
  //   console.log("times");
  //   console.log(convert);
  //   // console.log(selectedTime)

  //   const timeChange = { ...datee };
  //   // console.log(timeChange);
  //   let newarray = timeChange.sessions;
  //   // console.log("index " + index);
  //   timeChange.sessions[index][name] = convert;
  //   if (name === "startingTime") {
  //     for (let i = 0; i < index; i++) {
  //       if (
  //         convert >= newarray[i].startingTime &&
  //         convert <= newarray[i].endingTime
  //       ) {
  //         alert("already selected");
  //         timeChange.sessions[index][name] = null;
  //       } else {
  //         console.log("hereeeeee");
  //         timeChange.sessions[index][name] = convert;

  //         // setDatee({ ...timeChange });
  //       }
  //     }
  //   } else if (name === "endingTime") {
  //     for (let i = 0; i < index; i++) {
  //       if (
  //         convert >= newarray[i].startingTime &&
  //         convert <= newarray[i].endingTime
  //       ) {
  //         alert("already selected");
  //         timeChange.sessions[index][name] = null;
  //       } else {
  //         console.log("here");
  //         timeChange.sessions[index][name] = convert;
  //         // setDatee({ ...timeChange });
  //       }
  //     }
  //   }
  //   const starting = datee.sessions[index].startingTime;
  //   const ending = datee.sessions[index].endingTime;
  //   // if((starting || ending) && (||ending.isBefore(starting) )) alert('select a valid time')
  //   if (ending && moment(starting).isAfter(ending)) {
  //     return alert("Starting date should less than ending Date");
  //   }
  //   if (starting && moment(ending).isBefore(starting)) {
  //     return alert("hi");
  //   }
  //   console.log(timeChange, "timeChange");
  //   setDatee({ ...timeChange });

  //   if (
  //     datee.sessions[index].startingTime &&
  //     datee.sessions[index].endingTime
  //   ) {
  //     let count = 0;
  //     let starter = new Date(datee.sessions[index].startingTime).getTime();
  //     let ender = new Date(datee.sessions[index].endingTime).getTime();

  //     for (let i = starter; i < ender; i = starter) {
  //       starter += datee.duration * 60 * 1000;
  //       count++;
  //     }
  //     // datee.sessions[index].token = count
  //     setDatee((pre) => {
  //       return {
  //         ...pre,
  //         ["sessions"]: pre["sessions"].map((ele, num) => {
  //           if (num === index) {
  //             return { ...ele, ["totalTokens"]: count };
  //           } else return { ...ele };
  //         }),
  //       };
  //     });
  //   }
  // };

  const dayHandler = (index, day) => {
    const today = moment().format("dddd").toUpperCase();
    const todayindex = days.indexOf(today);
    // console.log(active);
    // console.log(moment().add(index-todayindex,'day').toLocaleString());
    setActive({
      date: moment()
        .add(index - todayindex, "day")
        .toLocaleString(),
      label: day,
    });
    console.log(active);
  };

  const handleSubmit = () => {
    console.log(datee);
    doctorApi
      .post("/timeSchedule", { schedule: datee, _id: id })
      .then((res) => {
        if (res.data.status) {
          alert("successfull");
          setCreated((pre) => !pre);
          setSchedulePopup((prev) => !prev);
        }
      }).catch((error)=>{
        console.log(error,'already Exit');
        show(error.response.data.message,error.response.status)
      })
  };

  const formattedTime = (timeValue) => {
    console.log("dd " + timeValue);
    const time = moment(timeValue, "HH:mm").format("hh:mm A");
    console.log("time " + time);
    return time.slice(0, 5);
  };
  const addmore = () => {
    let sessions = datee.sessions;
    let sloteLength = sessions.length + 1;
    console.log("sloteLength " + sloteLength);
    setDatee((prev) => ({
      ...prev,
      ["sessions"]: [
        ...sessions,
        { startingTime: null, endingTime: null, session: sloteLength },
      ],
    }));
  };

  const deleteSlot = (index, id, slotId) => {
    if (existingTime) {
      doctorApi
        .post(`/deleteSession/`, { id: id, slotId: slotId })
        .then((response) => {
          if (response.data.status) {
            show(response.data.message);
            setSchedulePopup(false);
            setExistingTime(false);
          }
        });
    } else {
      setDatee((prev) => {
        return {
          ...prev,
          ["sessions"]: prev.sessions.filter((ele, num) => num != index),
        };
      });
    }
  };

  const durationChange = (e) => {
    const { name, value } = e.target;
    setDatee((prev) => {
      return {
        ...prev,
        [name]: parseInt(value),
      };
    });
  };

  useEffect(() => {
    doctorApi.get(`/timeSlotes?id=${id}`).then((response) => {
      if (response.data.status) {
        setTimeSlots([...response.data.slotes]);
        let Dates = [];
        response.data.slotes.forEach((slot) => {
          let newDate = slot.date;
          console.log(newDate);
          Dates.push(moment(newDate).toDate());
          setExcludeDate([...Dates]);
        });
      }
    });
  }, [created]);

  // const [startDate, setStartDate] = useState(new Date());
  // const [minTime, setMinTime] = useState(moment().toDate());
  // const [maxTime, setMaxTime] = useState(moment().endOf("day").toDate());
  return (
    <div className="flex flex-col items-center w-full bg-sky-50 pt-20  relative ">
      <div className="w-full absolute top-3 right-6 bg-slate-500 text-white">
        <button
          className=" p-2 rounded-lg absolute top-3 right-6 bg-slate-500"
          onClick={() => navigate("/doctor/scheduled_slotes")}
        >
          Already Scheduled
        </button>
      </div>

      <div className=" w-4/5 bg-white px-10 rounded-2xl shadow-xl  mt-4 flex flex-col gap-4 ">
        <div className="text-center text-lg underline underline-offset-8 my-4 ">
          <h1>Schedule Consultation</h1>
        </div>
        <div className="flex mb-3 items-center ">
          <div className="w-52">
            <p className=" ">Consultation Duration</p>
          </div>
          <div className="w-52">
            <select
              name="duration"
              placeholder="Duration"
              onChange={durationChange}
              className="p-1 w-40 text-center bg-slate-100"
            >
              {duration.map((ele, index) => {
                return (
                  <option key={index} value={ele}>
                    {ele} mins
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex  mb-3 items-center">
            <div className="w-52">
              <label htmlFor="">Select the date</label>
            </div>
            <div className="w-52 flex flex-col">
              <div className="w-44 h-full border-2 p-2 overflow-hidden bg-slate-200">
                <DatePicker
                  selected={datee.datePicker}
                  onChange={(date) => handleDate(date)}
                  excludeDates={excluedDate}
                />
              </div>
              {/* <input
              type="date"
              name="date"
              value={datee?.date}
              onChange={handleDate}
              className="p-1 w-40 text-center bg-slate-100"
            /> */}
              {/* <p>disabled dates are already created</p> */}
            </div>
          </div>
          {/* <div className="mb-3 items-center">
            {datee.slotes.map((slot, index) => (
              <div key={index} className="mb-2">
                
                <label htmlFor="">Starting time : </label>
                <input
                  type="time"
                  name="startingTime"
                  value={formattedTime(slot?.startingTime)}
                  onChange={(e) => handleTime(e, index)} 
                  className="p-1 text-center"
                />
                <label htmlFor="">Ending Time</label>
                <input
                  type="time"
                  name="endingTime"
                  value={formattedTime(slot?.endingTime)}
                  onChange={(e) => handleTime(e, index)}
                  className="p-1 text-center"
                />
            
              </div>
            ))}
            <button className="p-2 bg-slate-400 mb-2" onClick={addmore}>
              Add More
            </button>
          </div> */}
        </div>
        {/* <div className="flex">
          <p>
            starting Time :{" "}
            {datee?.slotes?.[0]?.startingTime
              ? timeConvertion(datee?.slotes?.[0]?.startingTime)
              : ""}
          </p>
        </div>
        <div className="flex">
          <p>
            ending Time :
            {datee?.slotes?.[0]?.endingTime
              ? timeConvertion(datee?.slotes?.[0]?.endingTime)
              : ""}
          </p>
        </div> */}
        {/* <button className="bg-slate-500 p-2 rounded-lg" onClick={handleSubmit}>
          Submit
        </button> */}
      </div>

      {schedulePopup && (
        <div className=" flex flex-col bg-white absolute top-20 w-4/5 py-10 px-10 rounded-xl shadow-2xl">
          <p
            className="absolute  top-5 right-10 cursor-pointer hover:bg-red-800 rounded-full p-2 "
            onClick={() => setSchedulePopup(false)}
          >
            <GrClose />
          </p>
          <div className="my-3 ">
            <h2 className="mb-2">Add Time Slotes</h2>
            <hr />
          </div>
          <div className="flex gap-3 my-3 ">
            <p>Date</p>
            <span>:</span>
            <p>{datee.date}</p>
          </div>

          {datee.sessions.map((slot, index) => (
            <Fragment key={index}>
              <div className="w-full bg-emerald-400 flex justify-between text-white py-1 px-5 rounded-lg">
                <p> Slote NO:{slot.session}</p>
              </div>

              <div
                key={index}
                className="mb-2 flex justify-evenly w-full gap-4 "
              >
                <div className="flex flex-col my-3 w-1/4 ">
                  <label htmlFor="">Starting time : </label>
                  <input
                    type="time"
                    name="startingTime"
                    value={formattedTime(slot?.startingTime)}
                    onChange={(e) => handleTime(e, index)}
                    className="p-1 text-center bg-slate-500 w-full rounded-lg"
                  />
                  {/* <DatePicker
                    selected={new Date(slot.startingTime)}
                    onChange={(date) => handleTime(date, "startingTime", index)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    minTime={minTime}
                    maxTime={maxTime}
                  /> */}
                </div>
                <div className="flex flex-col my-3 w-1/4">
                  <label htmlFor="">Ending Time</label>
                  <input
                    type="time"
                    name="endingTime"
                    value={formattedTime(slot?.endingTime)}
                    onChange={(e) => handleTime(e, index)}
                    className="p-1 text-center  bg-slate-500 w-full rounded-lg "
                  />
                </div>
                <div className="flex flex-col my-3 w-1/4 ">
                  <p>No of Tokens</p>
                  <input
                    type="text"
                    value={slot?.totalTokens}
                    className="p-1 text-center  bg-slate-200 w-full rounded-lg"
                    disabled
                  />
                  {/* <DatePicker
                    selected={new Date(slot.endingTime)}
                    onChange={(date) => handleTime(date,'endingTime',index)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                  /> */}
                </div>
                <div className="flex flex-col  w-1/6 my-3 pt-4 justify-center items-center">
                  <DeleteButton
                    sessionId={slot._id}
                    id={datee._id}
                    clicking={deleteSlot}
                    index={index}
                  />
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
          <div className="flex justify-center">
            <button
              className="w-1/4 bg-green-700  text-white p-2 rounded-lg"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeScheduling;
