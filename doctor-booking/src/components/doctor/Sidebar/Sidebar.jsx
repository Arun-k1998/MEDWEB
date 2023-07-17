import React, { useContext, useState } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { BiSolidUser } from "react-icons/bi";
import { MdOutlineSettingsApplications } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { PiFlagBannerFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { doctorContext } from "../../../helper/contest/DoctorContext";
import { useSelector } from "react-redux";

function Sidebar() {
  const navigate = useNavigate();
  const doctor = useSelector((state) => state.doctor);
  
  const sideBarOnClick = (index,path)=>{
    const newBar = [...sideBar]
    newBar[index].active= true
    console.log(newBar);
    setSideBar([...newBar])
    navigate(path)
  }

  const sidBarContent = [
    {
      name: "Schedule Time",
      path: "/doctor/schedule",
      symbol: <FaUserDoctor className="mr-1" />,
      active:false
    },
    {
      name: "Appointments",
      path: "/doctor/appointments",
      symbol: <BiSolidUser className="mr-1" />,
      active:false
    },
    {
      name: "Patient List",
      path: "/doctor/patients",
      symbol: <MdOutlineSettingsApplications className="mr-1" />,
      active:false
    },
    {
      name: "Start Consultaion",
      path: "/doctor/consultation",
      symbol: <RiCalendarTodoFill className="mr-1" />,
      active:false
    },
  ];
  const [sideBar,setSideBar] = useState(sidBarContent)

  return (
    <div className="h-[88vh] w-full bg-[#189AB4] py-4 pt-16  font-serif sticky top-[12vh] ">
      <div className="h-14 bg-slate-400 flex items-center justify-center pl-4 md:justify-start text-sm lg:text-lg hover:bg-sky-800">
        <MdSpaceDashboard className="mr-1" />
        <p className="hidden md:block">Dashboard</p>
      </div>
      {doctor.approved === "approved"
        ? sideBar.map((content,index) => {
            return (
              
                <div key={index}  className="h-14  flex items-center justify-center pl-4 md:justify-start text-sm lg:text-lg hover:bg-sky-800">
                  {content.symbol}
                  <p
                    className="hidden md:block"
                    onClick={()=> sideBarOnClick(index,content.path) }
                  >
                    {content.name}
                  </p>
                </div>
              
            );
          })
        : ""}
    </div>
  );
}

export default Sidebar;
