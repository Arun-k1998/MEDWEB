import React, { useContext, useState } from "react";
import "./UserNotificatons.css";
import api from "../../../helper/axios/userAxios";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";
import { useDispatch, useSelector } from "react-redux";

function UserNotifications({ usernotifications,setDeleteNotification }) {
  const [isHovered, setIsHovered] = useState(false);
  const { show } = useContext(ToastifyContest);
  const { id } = useSelector((store) => store.user);
  const dispatch = useDispatch();
 
  const handleMouseEnter = () => {
    setIsHovered((prev) => !prev);
  };

  const handleMouseLeave = () => {
    setIsHovered((prev) => !prev);
  };

  const handleRemoveNotification = (notificationId) => {
    alert(notificationId);
    api
      .patch("/deleteNotification", { id: notificationId, userId: id })
      .then((res) => {
        if (res.data.status) {
          show(res.data.message);
          setDeleteNotification(pre=>!pre)
        }
      })
      .catch((error) => {
        if (error.response) {
          show(error.response.data.message, error.response.status);
        } else if (error.request) {
          navigate("/500");
        } else {
          console.log(error);
        }
      });
  };

  return (
    <div className="w-full h-full my-14 flex justify-center ">
      <ul className="list-disc">
        {usernotifications?.map((notification, index) => {
          return (
            <li key={index} className="my-3">
              <div className="flex gap-5">
                <div>
                  <p>{notification.message}</p>
                  <hr className="border-none h-0.5 bg-slate-600" />
                </div>
                <div
                  className="delete-button-container "
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleRemoveNotification(index)}
                >
                  <p className=" delete-button  cursor-pointer">
                    <span className="rotate-45">+</span>{" "}
                  </p>
                  {/* {isHovered && <div className="hover-message" onClick={()=>handleRemoveNotification(index)} >Click to delete</div>} */}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserNotifications;
