import React, { useRef, useState } from "react";
import profile from "../../../assets/profileImage.webp";
import { useLocation, useNavigate } from "react-router-dom";

function UserProfileSideBar({ user,edit }) {
  const location = useLocation();
    const navigate = useNavigate()
  const sideBarConent = [
    {
      name: "Profile",
      path: "/profile",
      active: location.pathname === "/profile" ? true : false,
    },
    {
      name: "Prescriptions",
      path: "/prescription",
      active: location.pathname === "/prescription" ? true : false,
    },
    {name:'Consultation History',
     path:'/consultation History',  
     active: location.path === '/consultation History' ? true : false 
    }
  ];

  const [sidebarContent, setSideBarContent] = useState(sideBarConent);
  const imageSelection = useRef(null);
  const handleProfileImage = () => {
    if (imageSelection.current) {
      imageSelection.current.click();
    }
  };

  return (
    <div className="w-[80%] h-[80%] my-10 mx-auto bg-slate-50 py-5">
      <div className="w-52 h-52 bg-slate-900 overflow-hidden rounded-full flex justify-center items-center mx-auto pt-8 relative">
        <img
          src={user.image ? `${VITE_SERVER_URL}/images/${user.image}` : profile}
          alt=""
          className="w-48 h-48 rounded-full border-8 border-dashed  border-sky-500   "
        />
      </div>
      <input type="file" hidden ref={imageSelection} />
      
     { !edit ?'': 
     <div className="w-full bg-slate-500 h-14">
        <button
        className="text-2xl text-center bg-black text-white w-7 h-7 rounded-full "
        onClick={handleProfileImage}
      >
        +
      </button>
     </div>
     
     }
     <div className="w-full flex justify-center">
        <p>{`${user.firstName} ${user.lastName}`}</p>
     </div>
     <div className="mt-5">
     {sidebarContent.map((content) => {
        return (
          <>
            {" "}
            <div
              className={` ${
                content.active ? "bg-slate-500 text-white " : ""
              }  w-full flex  justify-between px-5 items-center  cursor-pointer shadow-e h-14`}
              onClick={()=>navigate(content.path)}
            >
              <p>{content.name}</p>
              {content.active ? <span>{`>`}</span> : ""}
            </div>
            <hr className=" border w-full " />
          </>
        );
      })}
     </div>
      
    </div>
  );
}

export default UserProfileSideBar;
