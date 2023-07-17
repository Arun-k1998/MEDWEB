import moment from "moment/moment";
import React, { useEffect, useState } from "react";

function TimeScheduling() {
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
  
  
  const dayHandler = (index,day)=>{
    
    setActive({date:moment().add(index,'day').toLocaleString(),label:day})
    
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
            
        </div>
      </div>
    </div>
  );
}

export default TimeScheduling;
