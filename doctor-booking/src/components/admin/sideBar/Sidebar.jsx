import React, { useState } from "react";
import { MdSpaceDashboard } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { BiSolidUser } from "react-icons/bi";
import { MdOutlineSettingsApplications } from "react-icons/md";
import { RiCalendarTodoFill } from "react-icons/ri";
import { PiFlagBannerFill } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router-dom";
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarContent = [
    {
      name: "Dashboard",
      path: "/admin/dashBoard",
      symbol: <MdSpaceDashboard className="mr-1" />,
      active: location.pathname === "/admin/dashBoard" ? true : false,
    },
    {
      name: "Doctors",
      path: "/admin/doctors",
      symbol: <FaUserDoctor className="mr-1" />,
      active: location.pathname === "/admin/doctors" ? true : false,
    },
    {
      name: "Users",
      path: "/admin/users",
      symbol: <BiSolidUser className="mr-1" />,
      active: location.pathname === "/admin/users" ? true : false,
    },
    {
      name: "Dr Applications",
      path: "/admin/applications",
      symbol: <MdOutlineSettingsApplications className="mr-1" />,
      active: location.pathname === "/admin/applications" ? true : false,
    },
    {
      name: "Banners",
      path: "/admin/banner",
      symbol: <PiFlagBannerFill />,
      active: location.pathname === "/admin/banner" ? true : false,
    },
    {
      name: "specialization",
      path: "/admin/specialization",
      symbol: <MdOutlineSettingsApplications className="mr-1" />,
      active: location.pathname === "/admin/specialization" ? true : false,
    },
  ];

  const [sideBar, setSideBar] = useState(sidebarContent);
  return (
    <div className="h-[88vh] w-full bg-[#189AB4] py-4 pt-16  font-serif sticky top-[12v] ">
      {sideBar.map((content) => {
        return (
          <div
            className={`${
              content.active ? "shadow-2xl shadow-sky-900" : ""
            } cursor-pointer text-slate-300 h-14  flex items-center justify-center pl-4 md:justify-start text-sm lg:text-lg hover:bg-sky-800`}
          >
            {content?.symbol}
            <p
              className="hidden md:block "
              onClick={() => navigate(content.path)}
            >
              {content.name}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
