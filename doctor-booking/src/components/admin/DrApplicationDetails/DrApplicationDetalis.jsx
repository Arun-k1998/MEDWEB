import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "../../../helper/axios/adminAxios";

function DrApplicationDetalis() {

  const { id } = useParams();
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [doctor, setDoctor] = useState({});
  const [experience,setExperience] = useState([])

  const timeConvertion = (time)=>{
    const Time = new Date(time)
    const options = {month:'long',day:'numeric',year:'numeric'}
    const newTime = Time.toLocaleDateString(undefined,options)
    console.log(newTime);
    return newTime

  }

  const handleSubmit = ()=>{
    
    adminApi.post(`dr_register/${id}`).then((responses)=>{
      if(responses.data.status){
        alert('successfull')
      }
    })
  }
  
  useEffect(() => {
    adminApi.get(`/dr_data?id=${id}`).then((response) => {
      if (response.data.status) {
        console.log(response.data.doctor);
        setDoctor({ ...response.data.doctor });
        setExperience([...response.data.doctor.experience])
      }
    });
  },[]);

  return (
    <div className="w-10/12 h-5/6 shadow-lg bg-white rounded-2xl">
      <div className="w-full flex justify-center items-center h-44 ">
        <img
          src={`${VITE_SERVER_URL}/images/${doctor.image}`}
          alt=""
          className="h-full rounded-full"
        />
      </div>
      <div className="w-full flex flex-col">
        <div className=" w-full flex  ">
          <p>Full Name</p>
          <h2>{doctor.firstName +" "+ doctor.lastName}</h2>
        </div>
        <div className=" flex  ">
          <p>Email</p>
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
        </div>
        <div className="flex flex-col">
          <p>Experience</p>
          <div>
            {
            experience.map((obj)=>{
                return <div className="flex ">
                  <h1>{obj.hospital}</h1>
                  <h1>{timeConvertion(obj.from)}</h1>
                  <h1>{ timeConvertion(obj.to)}</h1>
                </div>
              })
            }
          </div>
        </div>


      </div>
      <button className="bg-black text-white " onClick={handleSubmit} >APPROVE</button>
    </div>
  );
}

export default DrApplicationDetalis;
