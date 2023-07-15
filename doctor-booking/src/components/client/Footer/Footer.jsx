import React from "react";
import icon from "../../../assets/logo/medweblogo.png";

function Footer() {
  return (
    <div className="w-full h-max bg-[#189AB4] mt-10  px-20 py-10 flex flex-col ">
      <div className="grid grid-cols-2 md:grid-cols-3 flex justify-center">
        <div className="flex flex-col justify-center ">
          <h1 className="mb-3">MEDWEB</h1>
          <p>About</p>
          <p>Career</p>
          <p>Contact Us</p>
        </div>
        <div className=" hidden md:block flex justify-center flex-col items-start">
          <div className="flex flex-col  justify-center">
            <h1 className="mb-3">Specialities</h1>
            <p>General Medicine</p>
            <p>ENT</p>
            <p>Dermatology</p>
            <p>Psychaitry</p>
          </div>
        </div>
        <div className="flex justify-center items-start">
          <p>hai</p>
        </div>
      </div>
      <div className="w-full flex justify-center mt-2">
        <div className="w-40  md:w-60">
          <img src={icon} alt="" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export default Footer;
