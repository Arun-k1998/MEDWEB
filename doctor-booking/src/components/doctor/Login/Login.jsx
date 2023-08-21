import React, { useContext, useEffect, useState } from "react";
import api from "../../../helper/axios/userAxios";
import { useLocation, useNavigate } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { userLogin } from "../../../redux/userSlice";
import validation from "../../../helper/FormValidation";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { doctorContext } from "../../../helper/contest/DoctorContext";
import { doctorLogin } from "../../../redux/doctorSlice";

function Login() {
  
  const initialValues = { email: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [submit, setSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [id,setId] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation()
  const [pathname,setPathName] = useState(location.pathname)

  const handleClick = () => {
    setFormErrors(validation(formValues, "login"));
    setSubmit(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
            "; path=/doctor";
         
          dispatch(doctorLogin(response.data.doctor))
         window.location.href = "/doctor/dashboard"
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

      <div className="flex  justify-end max-h-screen">
        <div className="relative inline-block text-left">
        <div className="flex flex-col gap-2">
          <label htmlFor=""> Select Login</label>
          <button
            onClick={toggleDropdown}
            type="button"
            className="inline-flex w-20 justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {pathname === '/login' ?'User' :'Doctor'}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          </div>
          
          {isOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <p
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  role="menuitem"
                  onClick={()=> {
                    setIsOpen(!open)
                    navigate('/login')}}
                >
                  User Login
                </p>
                <p
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  role="menuitem"
                  onClick={()=>{ 
                    setIsOpen(!open)
                    navigate('/doctor/login')}}
                >
                  Doctor Login
                </p>
                
              </div>
            </div>
          )}
        </div>
        </div>



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
        <p className="ml-2 cursor-pointer" onClick={()=> navigate('/doctor/signup')}> SignUp</p>
      </div>
    </div>
  </div>
  )
}

export default Login
