import React, { useState } from "react";
import './UserNotificatons.css'

function UserNotifications({ usernotifications }) {
    const [isHovered ,setIsHovered] = useState(false)

    const handleMouseEnter = () =>{
        setIsHovered(prev=>!prev)
    }

    const handleMouseLeave = ()=>{
        setIsHovered(prev=>!prev)
    }

  return (
    <div className="w-full h-full my-14 flex justify-center ">
      <ul className="list-disc">
        {usernotifications?.map((notification) => {
          return (
            <>
           
              <li >
                <div className="flex gap-5">
                <div>
                <p>{notification.message}</p> 
                <hr className="border-none h-0.5 bg-slate-600" />
                </div>
                <div className="delete-button-container " onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <p className=" delete-button  cursor-pointer"><span className="rotate-45">+</span> </p>
                {isHovered && <div className="hover-message">Click to delete</div>}
                </div>
                
                </div>
              </li>
             
            
              
            </>
          );
        })}
      </ul>
    </div>
  );
}

export default UserNotifications;
