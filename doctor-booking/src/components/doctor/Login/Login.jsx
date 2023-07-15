import React, { useContext, useEffect, useState } from "react";
import api from "../../../helper/axios/userAxios";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { userLogin } from "../../../redux/userSlice";
import validation from "../../../helper/formValidation";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { doctorContext } from "../../../helper/contest/DoctorContext";

function Login() {
  const {setDoctor,doctor,setApproved,setId} = useContext(doctorContext)
  const initialValues = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [submit, setSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = () => {
    setFormErrors(validation(formValues, "login"));
    setSubmit(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && submit) {
      doctorApi.post("/login", formValues).then((response) => {
        if (response.data.message == "Success") {
          let date = new Date();
          date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
          const expires = "expires=" + date.toUTCString();
          document.cookie =
            "doctorToken=Bearer " +
            response.data.token +
            ";" +
            expires +
            "; path=/";
          const { firstName, _id, email,approved } = response.data.doctor;
          setDoctor(firstName)
          setApproved(approved)
          setId(_id)
          navigate("/doctor/dashboard");
        } else {
          alert(response.data.message);
        }
      });
    }
  }, [formErrors,submit]);

  return (
    <div className="flex justify-center items-center h-screen bg-login-signup ">
    <div className="flex flex-col justify-center text-center backdrop-blur-sm bg-white/30 rounded-2xl sm:w-2/5 shadow-lg py-5  px-16 ">
      <h2 className="text-3xl font-serif ">Login</h2>
      <div >
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formValues.email}
          onChange={handleChange}
          className=" rounded-lg w-full  p-2 mt-8 hover:bg-slate-100"
        />
        {formErrors.email && (
          <p style={{ color: "red" }}>{formErrors.email}</p>
        )}
      </div>
      <div>
        <div className="flex flex-row relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formValues.password}
            onChange={handleChange}
            className=" rounded-lg  p-2 mt-8 w-full hover:bg-slate-100"
          />
          <AiOutlineEye
            className="absolute top-1/2 right-3 translate-y-2 w-11 text-slate-500 cursor-pointer"
            onMouseEnter={() => setShowPassword(!showPassword)}
            onMouseLeave={() => setShowPassword(!showPassword)}
          />
        </div>
        {formErrors.password && (
          <p style={{ color: "red" }}>{formErrors.password}</p>
        )}
      </div>

      <button
        className="rounded-lg bg-cyan-900 hover:bg-cyan-950 py-2 mt-8 text-white text-lg "
        onClick={handleClick}
      >
        Login
      </button>
      <div className="flex mt-4 w-full justify-center" >
        <p className="text-blue-600">Don't have a account? </p>
        <p className="ml-2 cursor-pointer" onClick={()=> navigate('/signup')}> SignUp</p>
      </div>
    </div>
  </div>
  )
}

export default Login
