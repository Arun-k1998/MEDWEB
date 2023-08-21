import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../helper/axios/adminAxios";
import profileImage from "../../../assets/profileImage.webp";
import './drApplications.css'
function DrApplicationDetalis() {
  const { id } = useParams();
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [doctor, setDoctor] = useState({});
  const [experience, setExperience] = useState([]);
  const navigate = useNavigate()

  const timeConvertion = (time) => {
    const Time = new Date(time);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const newTime = Time.toLocaleDateString(undefined, options);
    console.log(newTime);
    return newTime;
  };

  const handleSubmit = () => {
    adminApi.post(`dr_register/${id}`).then((responses) => {
      if (responses.data.status) {
        alert("successfull");
        navigate('/admin/applications')
      }
    });
  };

  useEffect(() => {
    adminApi.get(`/dr_data?id=${id}`).then((response) => {
      if (response.data.status) {
        console.log(response.data.doctor);
        setDoctor({ ...response.data.doctor });
        setExperience([...response.data.doctor.experience]);
      }
    });
  }, []);

  return (
    <div className="w-10/12 h-5/6 shadow-lg  rounded-2xl overflow-y-scroll doctorContainer">
      <div className="w-full flex justify-center items-center h-44 ">
        <img
          src={
            doctor?.image
              ? `${VITE_SERVER_URL}/images/${doctor?.image}`
              : profileImage
          }
          alt=""
          className="h-full rounded-full"
        />
      </div>
      {/* <div className="w-full flex flex-col"> */}
      <div className="grid grid-cols-3  bg-slate-100 mx-20">
        <div className="flex flex-col gap-4 ">
          <div className="bg-slate-300 p-2 rounded-l-md">
            <p >Full Name</p>
          </div>
          <div className="bg-slate-300 p-2 rounded-l-md">
            <p>Email</p>
          </div>
          <div className="bg-slate-300 p-2 rounded-l-md">
            <p>Phone Number</p>
          </div>
          <div className="bg-slate-300 p-2 rounded-l-md">
            <p>{doctor.registerNumber}</p>
          </div>
          <div className="bg-slate-300 p-2 rounded-l-md">
            <p>Counsil Name</p>
          </div>
          <div className="bg-slate-300 p-2 rounded-l-md">
            <p>Year of Registeration</p>
          </div>
          <div className=" p-2 experience rounded-l-md">
          <p>Experience</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <div className="bg-slate-300 p-2">
            <span>:</span>
          </div>
          <div className="bg-slate-300 p-2">
            <span>:</span>
          </div>
          <div className="bg-slate-300 p-2">
            <span>:</span>
          </div>
          <div className="bg-slate-300 p-2">
            <span>:</span>
          </div>
          <div className="bg-slate-300 p-2">
            <span>:</span>
          </div>
          <div className="bg-slate-300 p-2">
            <span>:</span>
          </div>
          <div className=" p-2 experience">
            <span>:</span>
          </div>
        </div>
        <div className="flex flex-col gap-4 ">
          <div className="bg-slate-300 p-2 rounded-r-md ">
            <h2>{doctor.firstName + " " + doctor.lastName}</h2>
          </div>
          <div className="bg-slate-300 p-2 rounded-r-md">
            <h2>{doctor.email}</h2>
          </div>
          <div className="bg-slate-300 p-2 rounded-r-md">
            <h2>{doctor.phoneNumber}</h2>
          </div>
          <div className="bg-slate-300 p-2 rounded-r-md">
            <h2>{doctor.registerNumber}</h2>
          </div>
          <div className="bg-slate-300 p-2 rounded-r-md">
            <h2>{doctor.councilName}</h2>
          </div>
          <div className="bg-slate-300 p-2 rounded-r-md">
            <h2>{doctor.yearOfRegisteration}</h2>
          </div>
          <div className=" p-2 experience rounded-r-md">
            <ul className="list-disc">
            {experience.map((obj) => {
              return (
                <li >
                  <h1>{obj.hospital}</h1>
                  <h1>{timeConvertion(obj.from)}</h1>
                  <h1>{timeConvertion(obj.to)}</h1>
                </li>
              );
            })}
            </ul>
         
          </div>
        </div>
        {/* <div className="w-96 bg-slate-600 mx-auto flex  justify-start">
          <p>Full Name</p>
          <span>:</span>
          <h2>{doctor.firstName +" "+ doctor.lastName}</h2>
        </div>
        <div className=" w-96 bg-slate-600 mx-auto flex  justify-around ">
          <p>Email</p>
          <span>:</span>
          <h2>{doctor.email}</h2>
        </div>
        <div className=" flex ">
          <p>Phone Number</p>
          <h2>{doctor.phoneNumber}</h2>
        </div>
        <div className=" flex ">
          <p>Registeraion Number</p>
          <h2>{doctor.registerNumber}</h2>
        </div>
        
        <div className="flex">
           <p>Counsil Name</p>
           <h2>{doctor.councilName}</h2>
        </div>
        <div className="flex" >
          <p>Year of Registeration</p>
          <h2>{doctor.yearOfRegisteration}</h2>
        </div> */}
        <div className="flex flex-col">
         
          <div>
            
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-2 mb-5">
      <button className="bg-black text-white p-2 rounded-lg w-32 hover:bg-green-900 " onClick={handleSubmit}>
        APPROVE
      </button>
      </div>
      
    </div>
  );
}

export default DrApplicationDetalis;
