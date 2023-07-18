import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { useSelector } from "react-redux";

function TimeScheduling() {
  const {id} = useSelector(store=> store.doctor)
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
  const [active, setActive] = useState({date:moment(),label:moment().format("dddd")});
  const [datee,setDatee] = useState({date:"",slotes:[{startingTime:"",endingTime:""}]})
  const [date,setDate] = useState("")
  const [existingTime,setExistingTime] = useState([{}])

  const handleDate = (e)=>{
    const {name,value} = e.target
    console.log(name,value);
    console.log(id);
    setDatee(date=>{return{...date, [name] :value}})
    doctorApi.get(`/timeSlotes?id=${id}&date=${value}`).then((response)=>{
      console.log(response.data.slotes);
      setExistingTime([...response.data.slotes])
    })
  }

  const handleTime = (e)=>{
    const {name,value} = e.target

    const timeChange = {...datee}
    console.log(timeChange);
    timeChange.slotes[0][name] = value
    setDatee({...timeChange})
  }

  const dayHandler = (index,day)=>{
   const today =  moment().format('dddd').toUpperCase()
   const todayindex = days.indexOf(today)
    // console.log(active);
    // console.log(moment().add(index-todayindex,'day').toLocaleString());
    setActive({date:moment().add(index-todayindex,'day').toLocaleString(),label:day})
    console.log(active);
  } 

  const handleSubmit = ()=>{
    console.log(datee);
    doctorApi.post('/timeSchedule',{schedule:datee,_id:id}).then((res)=>{
     if(res.data.status){
      alert('successfull')
     }
    })
  }

  const datefinder=(e)=>{
    const{value} = e.target
    doctorApi.get('/timeSlotes',{_id:id,date:value}).then((response)=>{
          setExistingTime([...response.data.slotes])
    })
  }

  return (
    <div className="flex flex-col px-20">
      <div>
        <h1>Schedule Timings</h1>
        <div>
          <p>Timing Slot Duration</p>
          <select name="duration" id="" placeholder="Durat">
            {duration.map((ele,index) => {
              return <option key={index} value={ele}>{ele} mins</option>;
            })}
          </select>
        </div>
        <div className="flex w-full gap-4 flex-wrap ">
          {days.map((day,index) => (
            <div key={index}
              onClick={() => dayHandler(index,day) }
              className={`${
                active.label.toLowerCase() === day.toLowerCase()
                  ? "bg-red-400"
                  : "bg-slate-500"
              } p-2 text-white cursor-pointer`}
            >
              {day}
            </div>
          ))}
        </div>
        <div>
        <p>{datee ?. date}</p>
          <input type="date" name='date' value={datee?.date} onChange={handleDate} />
      <input type="time" name="startingTime" value={datee?.slotes?.[0]?.starting} onChange={handleTime} />
      <input type="time" name="endingTime" value={datee?.ending} onChange={handleTime} />
        </div>
        <div className="flex">
            <p>starting Time : {datee?.slotes?.[0]?.starting}</p>
        </div>
        <div className="flex">
          <p>ending Time :{datee?.ending}</p>
        </div>
        <button className="bg-slate-500 p-2 rounded-lg" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default TimeScheduling;
