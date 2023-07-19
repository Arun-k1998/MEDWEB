import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { useSelector } from "react-redux";
import { GrClose } from "react-icons/gr";
import DeleteButton from "../../../container/deleteButton/DeleteButton";
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
    duration: 0,
    slotes: [{ startingTime: null, endingTime: null, slot: 1 ,token:0}],
  });
  const [date, setDate] = useState("");
  const [existingTime, setExistingTime] = useState({});
  const [timeSlotes, setTimeSlots] = useState([]);
  const [schedulePopup, setSchedulePopup] = useState(false);

  const timeConvertion = (time) => {
    const convertedDate = moment(time, "HH:mm").format("LT");
    return convertedDate;
  };

  const handleDate = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    console.log(id);
    let today = moment();
    let currentDate = moment(value);
    if (currentDate.isBefore(today)) {
      return alert("Select a Valid day");
    }
    if (currentDate.isAfter(today)) console.log("after today");
    let formatedDate = currentDate.format("ll");
    console.log("current ", currentDate);
    let previous = timeSlotes.filter((obj) => {
      console.log(moment(obj.date).format("ll"));
      return formatedDate === moment(obj.date).format("ll");
    });
    if (previous.length > 0) {
      console.log(previous[0]);

      setDatee({
        ...previous[0],
        [name]: previous[0].date.slice(0, 10),
        ["slotes"]: previous[0].slotes.map((obj) => {
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
      setDatee({
        date: value,
        duration: 0,
        slotes: [{ startingTime: null, endingTime: null, slot: 1 }],
      });
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
    const combinedDate = date + " " + value;

    const selectedTime = moment(value).format("LT");
    const convert = moment(combinedDate, "YYYY-MM-DD HH:mm").toDate();
    // console.log(convert)
    const convertedDate = moment(convert).format("LT"); // Modify the format as per your needs

    // console.log("new "+convertedDate)
    console.log(convert);
    // console.log(selectedTime)

    const timeChange = { ...datee };
    // console.log(timeChange);
    let newarray = timeChange.slotes;
    console.log("index " + index);
    timeChange.slotes[index][name] = convert;
    if (name === "startingTime") {
      for (let i = 0; i < index; i++) {
        if (
          convert >= newarray[i].startingTime &&
          convert <= newarray[i].endingTime
        ) {
          alert("already selected");
          timeChange.slotes[index][name] = null;
        } else {
          console.log("hereeeeee");
          timeChange.slotes[index][name] = convert;

          setDatee({ ...timeChange });
        }
      }
    } else if (name === "endingTime") {
      for (let i = 0; i < index; i++) {
        if (
          convert >= newarray[i].startingTime &&
          convert <= newarray[i].endingTime
        ) {
          alert("already selected");
          timeChange.slotes[index][name] = null;
        } else {
          console.log("here");
          timeChange.slotes[index][name] = convert;
          setDatee({ ...timeChange });
        }
      }
    }

    if(datee.slotes[index].startingTime && datee.slotes[index].endingTime ){
      
      let count = 0
      let starter = new Date(datee.slotes[index].startingTime).getTime()
      let ender = new Date(datee.slotes[index].endingTime).getTime()
      for(let i =starter ; i < ender; i=starter){
        starter += 10*60*1000
        count++
        
      }
      // datee.slotes[index].token = count
      setDatee(pre=>{
        return {
          ...pre, ['slotes']: pre['slotes'].map((ele,num)=>{
            if(num === index){
              return {...ele,['token'] : count}
            }
            else return {...ele}
          })
        }
      })

    }
    
  };

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
        }
      });
  };

  const formattedTime = (timeValue) => {
    console.log("dd " + timeValue);
    const time = moment(timeValue, "HH:mm").format("hh:mm A");
    console.log("time " + time);
    return time.slice(0, 5);
  };
  const addmore = () => {
    let slotes = datee.slotes;
    let sloteLength = slotes.length + 1;
    console.log("sloteLength " + sloteLength);
    setDatee((prev) => ({
      ...prev,
      ["slotes"]: [
        ...slotes,
        { startingTime: null, endingTime: null, slot: sloteLength },
      ],
    }));
  };

  const deleteSlot = (index)=>{
    alert("Delete")
    setDatee(prev =>{
      return {
        ...prev, ['slotes']:prev.slotes.filter((ele,num)=> num!= index)
      }
    })
  }

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
      }
    });
  }, []);
  return (
    <div className="flex flex-col items-center w-full bg-sky-50 pt-20  relative ">
      <div className=" w-4/5 bg-white px-10 rounded-2xl shadow-xl  ">
        <div className="text-center text-lg underline underline-offset-8 my-4 ">
          <h1>Schedule Consultation</h1>
        </div>
        <div className="flex mb-3 items-center">
          <p className="mr-2 ">Consultation Duration</p>
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

        {/* <div className="flex w-full gap-4 flex-wrap ">
          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => dayHandler(index, day)}
              className={`${
                active.label.toLowerCase() === day.toLowerCase()
                  ? "bg-red-400"
                  : "bg-slate-500"
              } p-2 text-white cursor-pointer`}
            >
              {day}
            </div>
          ))}
        </div> */}
        <div className="flex flex-col">
          <div className="flex gap-4 mb-3 items-center">
            <label htmlFor="">Select the date</label>
            <input
              type="date"
              name="date"
              value={datee?.date}
              onChange={handleDate}
              className="p-1 w-40 text-center bg-slate-100"
            />
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
        {existingTime?.doctorId && <p>hello</p>}
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

          {datee.slotes.map((slot, index) => (
            <>
              <div className="w-full bg-emerald-400 flex justify-between text-white">
                <p> Slote NO:{slot.slot}</p>
              </div>

              <div key={index} className="mb-2 flex justify-evenly w-full gap-4 ">
                <div className="flex flex-col my-3 w-1/4">
                  <label htmlFor="">Starting time : </label>
                  <input
                    type="time"
                    name="startingTime"
                    value={formattedTime(slot?.startingTime)}
                    onChange={(e) => handleTime(e, index)}
                    className="p-1 text-center bg-slate-500 w-full"
                  />
                </div>
                <div className="flex flex-col my-3 w-1/4">
                  <label htmlFor="">Ending Time</label>
                  <input
                    type="time"
                    name="endingTime"
                    value={formattedTime(slot?.endingTime)}
                    onChange={(e) => handleTime(e, index)}
                    className="p-1 text-center  bg-slate-500 w-full"
                  />
                </div>
                <div className="flex flex-col my-3 w-1/4 ">
                  <p>No of Tokens</p>
                  <input
                    type="text"
                    value={slot?.token}
                    className="p-1 text-center  bg-slate-200 w-full"
                    disabled
                  />
                </div>
                <div className="flex flex-col  w-1/6 my-3 pt-4 justify-center items-center" >
                  
                  <DeleteButton clicking={deleteSlot} index={index} />
                </div>
              </div>
            </>
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
