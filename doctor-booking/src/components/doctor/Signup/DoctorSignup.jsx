import React, { useEffect, useState } from "react";
import validation from "../../../helper/formValidation";
import { useNavigate } from "react-router-dom";
import { doctorApi } from "../../../helper/axios/doctorAxios";

function DoctorSignup() {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    country_code: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    otp: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formError, setformError] = useState({});
  const [submit, setSubmit] = useState(false);
  const [otp, setOtp] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    console.log({ name, value });
  };

  const handleSubmit = () => {
    setformError(validation(formValues, "signUp"));
    setSubmit(true);
  };

  const otpSubmit = () => {
    doctorApi.post("verify_otp", { ...formValues }).then((response) => {
      if (response.data.status) {
        navigate("/");
      }
    });
  };

  const resendOTP = () => {
    doctorApi
      .post("/resendotp", {
        phoneNumber: formValues.phoneNumber,
        country_code: formValues.country_code,
      })
      .then((response) => {
        if (response.data.status) {
          log(response.data.message);
          setTimer(60);
        }
      });
  };

  useEffect(() => {
    let interValId;
    if (Object.keys(formError).length === 0 && submit) {
      doctorApi
        .post("/signup", {
          ...formValues,
          country_code: formValues.country_code,
        })
        .then((response) => {
          if (response.data.status) {
            setOtp(!otp);
            interValId = setInterval(() => {
              setTimer((preTime) => preTime - 1);
            }, 1000);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

    return () => {
      clearInterval(interValId);
    };
  }, [formError]);
  const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes} : ${remainingSeconds.toString().padStart(2, "0")} `;
  };

  return (
    //resend otp with import form component
    <div className=" flex justify-center items-center h-screen w-full  bg-login-signup ">
      {otp && (
        <div className="md:w-[50%] lg:w-[25%] h-max-h-fit bg-cyan-100 p-4 flex flex-col justify-center items-center rounded-2xl shadow-2xl text-center ">
          <div>
            <h1 className="font-serif text-xl">Verify OTP</h1>
          </div>
          <div className="flex flex-col justify-center items-center text-center mt-6 w-full">
            <input
              type="number"
              placeholder="Enter OTP"
              value={formValues.otp}
              name="otp"
              onChange={handleChange}
              required
              className="p-2 mb-5 rounded-xl w-full "
            />
            <button
              className="rounded bg-cyan-500 hover:bg-cyan-600 p-2 w-2/4 mb-5 "
              onClick={otpSubmit}
            >
              Verirfy
            </button>
            <div>
              {timer > 0 ? (
                <p>Resend OTP in {formatTime(timer)}</p>
              ) : (
                <p
                  className="hover:text-red-500 hover:cursor-pointer"
                  onClick={resendOTP}
                >
                  Click here to resend otp
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!otp && (
        <div className=" flex flex-col item-center justify-center">
          <div className="max-w-[900px] w-ful mx-auto backdrop-blur-sm bg-white/30 shadow-2xl p-8 rounded-lg font-serif ">
            <div className="flex item-center justify-between">
              <p className="text-xl font-bold mb-2 text-center">
                Create Account
              </p>
             
            </div>
            <div className="formInput mb-2 flex flex-col w-72 ">
              <label htmlFor="">First name</label>
              <input
                className=" rounded-md  p-2"
                type="text"
                placeholder="First Name"
                required
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
              />
              {formError.firstName && (
                <p style={{ color: "red" }}>{formError.firstName}</p>
              )}
            </div>
            <div className="formInput mb-2 flex flex-col w-72">
              <label htmlFor="">Last Name</label>
              <input
                className=" rounded-md p-2 "
                type="text"
                placeholder="Last Name"
                required
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
              />
              {formError.lastName && (
                <p style={{ color: "red" }}>{formError.lastName}</p>
              )}
            </div>
            <div className="formInput mb-2 flex flex-col w-72">
              <label htmlFor="">Email</label>
              <input
                className="rounded-md p-2"
                type="email"
                placeholder="Email address"
                required
                name="email"
                value={formValues.email}
                onChange={handleChange}
              />
              {formError.email && (
                <p style={{ color: "red" }}>{formError.email}</p>
              )}
            </div>
            <div className="formInput mb-2 flex flex-col w-72">
              <div>
                <label htmlFor="">Phone Number</label>
                <div className="flex">
                  <select
                    className="rounded-md mr-1 p-2"
                    id=""
                    name="country_code"
                    onChange={handleChange}
                  >
                    <option value="">Code</option>
                    <option value="+91">India +91</option>
                    <option value="+1">Canada +1</option>
                  </select>

                  <input
                    style={{ width: "100%" }}
                    type="phone"
                    placeholder="Phone Number"
                    className="rounded-md p-2 "
                    name="phoneNumber"
                    value={formValues.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  {formError.country_code && (
                    <p style={{ color: "red" }}>{formError.country_code}</p>
                  )}
                  {formError.phoneNumber && (
                    <p style={{ color: "red" }}>{formError.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="formInput mb-2 flex flex-col w-72">
              <label htmlFor=""> Password</label>
              <input
                className=" rounded-md p-2 "
                type="password"
                placeholder="Password"
                required
                name="password"
                value={formValues.password}
                onChange={handleChange}
              />
              {formError.password && (
                <p style={{ color: "red" }}>{formError.password}</p>
              )}
            </div>
            <div className="formInput mb-2 flex flex-col w-72">
              <label htmlFor=""> Confirm Password</label>
              <input
                className="rounded-md p-2 "
                type="password"
                placeholder="Confirm Password"
                required
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
              />
              {formError.confirmPassword && (
                <p style={{ color: "red" }}>{formError.confirmPassword}</p>
              )}
            </div>
            <div className="formInput mb-2 text-center">
              <button
                className="rounded bg-teal-600 hover:bg-cyan-600 p-1.5 "
                onClick={handleSubmit}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorSignup
