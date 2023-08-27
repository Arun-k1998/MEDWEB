import React, { useEffect, useState } from "react";
import api from "../../../helper/axios/userAxios";

function UserChat({ data, currentUserId, online }) {
  const [doctorData, setDoctorData] = useState(null);
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const getUser = async () => {
      const doctorId = data.members.find((member) => member !== currentUserId);
      try {
        api.get(`/chat/doctor/${doctorId}`).then((res) => {
          const { data } = res;
          setDoctorData(data);
        });
      } catch (error) {}
    };
    getUser();
  }, []);

  return (
    // <div className="w-full h-28 flex items-center bg-white p-4 my-4 rounded-lg ">
    <>
      <div className="w-[7rem] h-[7rem] flex items-center ">
        <div className="w-[6rem] h-[6rem] rounded-full overflow-hidden ">
          <img
            src={`${serverUrl}images/${doctorData?.image}`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="w-full h-full flex flex-col gap-2 justify-around ml-3 ">
        <div className="flex ml-[1.5rem] gap-2">
          <p>{doctorData?.firstName}</p>
          <p>{doctorData?.lastName}</p>
        </div>
        <div className="flex items-center gap-2 ">
          {online ?(
            <>
              <div className="w-4 h-4 rounded-full bg-green-400 "></div>
              <p>Online</p>
            </>
          ):<p>Offline</p>}
        </div>
      </div>
    </>
    // </div>
  );
}

export default UserChat;
