import React from "react";
import './Client404.css'
import { useNavigate } from "react-router-dom";

function client404Component() {
    const navigate = useNavigate()
  return (
    <div className="w-full flex flex-col justify-center gap-8 items-center h-[100vh] ">
        <div className="w-full flex justify-center gap-4 ">
        <p className=" text-9xl text-red-400 four">4</p>
      <div className="w-32 h-32 rounded-full border-4  border-red-300 circle">

        </div>
      <p className=" text-9xl text-red-400 four ">4</p>
        </div>
        <div className="w-full flex justify-center">
        <p className="text-4xl">Page Not Found</p>

        </div>
        <div>
            <button className="bg-red-400 text-white p-2 w-32 text-xl rounded-lg cursor-pointer hover:shadow-lg hover:shadow-red-500  client404button" onClick={()=> navigate('/')}> Go Home</button>
        </div>
     
    </div>
  );
}

export default client404Component;
