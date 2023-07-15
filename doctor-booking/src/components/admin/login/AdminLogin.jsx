import React, { useState } from "react";
import api from "../../../helper/axios/userAxios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function AdminLogin() {
  const initialValues = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = () => {
    api.post("/admin/login",formValues).then((response) => {
        if(response.status == 200){
          let date = new Date()
          date.setTime(date.getTime()+1*24*60*60*1000)
          let expires = 'expires='+date.toUTCString()
          document.cookie = "adminToken=Bearer "+response.data.token+';'+expires+'; path=/admin'
          // Cookies.set('admin',response.data.token,{expires:1})
          navigate('/admin/dashboard')
        }
       
    }).catch(({response})=>{
        console.log(response.data.message);
    })
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col bg-red-100 px-8 py-4 rounded-lg shadow-xl text-center w-1/2">
        <h2 className="font-serif text-2xl ">Login</h2>
        <input
          className="p-2  mt-6 bg-transparent border-b-4 border-white"
          type="email"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleChange}
        />
        <input
          className="p-2  mt-6  bg-transparent border-b-4 border-white"
          type="password"
          name="password"
          placeholder="Password"
          value={formValues.password}
          onChange={handleChange}
        />
        <button className="text-black bg-red-400 mt-6 rounded-lg p-2" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
