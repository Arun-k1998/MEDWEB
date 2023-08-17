import React, { useRef, useState } from "react";
import profile from "../../../assets/profileImage.webp";
import { useLocation, useNavigate } from "react-router-dom";

function UserProfileSideBar({ user,edit,setImage }) {
  const {VITE_SERVER_URL}  = import.meta.env
  const location = useLocation();
  const navigate = useNavigate()
  const sideBarConent = [
    {
      name: "Profile",
      path: "/profile",
      active: location.pathname === "/profile" ? true : false,
    },
   
    {name:'Payment History',
     path:'/consultation_history',  
     active: location.pathname === '/consultation_history' ? true : false 
    }
  ];


  const [sidebarContent, setSideBarContent] = useState(sideBarConent);
  const imageSelection = useRef(null);
  const handleProfileImage = () => {
    if (imageSelection.current) {
      imageSelection.current.click();
      
    }
  };

  const handleImageChange = (e)=>{
    const {name}= e.target
   setImage(e?.target?.files[0])
    
  }

  return (
    <div className="w-[80%] h-[80%] my-10 mx-auto bg-slate-50 py-5">
      <div className="w-52 h-52 bg-slate-900 overflow-hidden rounded-full flex justify-center items-center mx-auto pt-8 relative">
        <img
          src={user?.image ? `${VITE_SERVER_URL}/userImages/${user?.image}` : profile}
          alt=""
          className="w-48 h-48 rounded-full border-8 border-dashed  border-sky-500   "
        />
      </div>
      <input type="file" name="image" hidden ref={imageSelection} onChange={handleImageChange} />
      
     { !edit ?'': 
     <div className="w-7 h-7 flex justify-center  mx-auto ">
        <button
        className="text-2xl text-center bg-black text-white w-7 h-7 rounded-full "
        onClick={handleProfileImage}
      >
        +
      </button>
     </div>
     
     }
     <div className="w-full flex justify-center gap-3 my-5 text-xl font-serif text-red-500 ">
      <p>Wallet Amount :</p>
     <p>{user?.wallet}</p>
     </div>
     <div className="mt-5">
     {sidebarContent.map((content,index) => {
        return (
          <>
            {" "}
            <hr className=" border w-full " />
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
