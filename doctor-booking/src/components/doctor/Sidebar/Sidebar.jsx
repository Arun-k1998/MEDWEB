import React, { useContext } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { BiSolidUser } from "react-icons/bi";
import { MdOutlineSettingsApplications } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { PiFlagBannerFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { doctorContext } from "../../../helper/contest/DoctorContext";

function Sidebar() {
    const navigate = useNavigate();
    const {approved}  = useContext(doctorContext)
    return (
      <div className="h-[88vh] w-full bg-[#189AB4] py-4 pt-16  font-serif sticky top-[12vh] ">
        <div className="h-14 bg-slate-400 flex items-center justify-center pl-4 md:justify-start text-sm lg:text-lg hover:bg-sky-800">
          <MdSpaceDashboard className="mr-1" />
          <p className="hidden md:block">Dashboard</p>
        </div>
        {
            approved === 'approved' ? <>
             <div className="h-14 flex items-center justify-center pl-4 md:justify-start text-sm lg:text-lg hover:bg-sky-800">
          <FaUserDoctor className="mr-1" />
          <p className="hidden md:block">Schedule Time</p>
        </div>
        <div className="h-14 flex items-center justify-center pl-4  md:justify-start text-sm lg:text-lg hover:bg-sky-800">
          <BiSolidUser className="mr-1" />
          <p className="hidden md:block">Appointments</p>
        </div>
        <div className="h-14 flex items-center justify-center text-sm lg:text-lg pl-4 md:justify-start hover:bg-sky-800">
          <MdOutlineSettingsApplications className="mr-1" />
          <p className="hidden md:block">Patient List</p>
        </div>
        <div className="h-14 flex items-center justify-center  pl-4 md:justify-start text-sm lg:text-lg hover:bg-sky-800">
          <RiCalendarTodoFill className="mr-1" />
          <p className="hidden md:block  ">Start Consultaion</p>
        </div>
            </> : ''
        }
       
        
   
      </div>
    );
}

export default Sidebar
