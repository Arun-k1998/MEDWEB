import React from 'react'
import moment from 'moment';

function UserPrescripton({consultaion}) {
    const formateDate = (date) => {
        let result = moment(date).format("LL");
        return result;
      };
  return (
    <div className="w-[90%] h-[80%] my-10 mx-auto bg-slate-50 py-5 relative ">
       <div className='w-full grid grid-cols-3 gap-4' >
       {
        consultaion.map((consultaioData)=>{
            return <div className='bg-slate-500' >
                <div className='w-48 h-48 overflow-hidden mx-auto rounded-full bg-gray-50'>
                        <img src="" alt="" />
                </div>
             <p>{formateDate(consultaioData.date)}</p>
            </div> 
          
        })
      }
       </div>
      
    </div>
  )
}

export default UserPrescripton
