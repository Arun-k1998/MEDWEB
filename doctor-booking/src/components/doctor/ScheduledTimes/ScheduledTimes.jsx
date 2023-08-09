import React, { Fragment } from 'react'
import moment from 'moment';

function ScheduledTimes({scheduledDates}) {
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
      console.log(scheduledDates);
  return (
    <div className="w-[90%] h-full mx-auto  py-10  ">
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
                            {
                        schedule?.sessions
                        ?.map((session,index)=>{
                              return <p>{session?.session}</p>
                                 })
                            }</td>
                       
                    <td className="px-6 py-4 cursor-pointer underline underline-offset-2">
                      kkk
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
  </div>
  )
}

export default ScheduledTimes
