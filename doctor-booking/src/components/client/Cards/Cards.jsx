import React, { useEffect } from "react";
import "./cards.css";
import api from "../../../helper/axios/userAxios";

function Cards({ specialization }) {
  const server_url = import.meta.env.VITE_SERVER_URL;

  return (
    <div>
      <div className="mt-5 horizontal_scroll bg-[#D4F1F4] py-28 px-20 Specialities">
        <h1 className=" mb-5 font-bold text-3xl">Specialities</h1>
        <h2 className=" mb-5">Consult with docotors as per your need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-scroll overflow-y-hidden py-8">
          {specialization.map((data) => {
            return (
              <div className=" rounded-lg bg-white overflow-hidden text-center">
                <div>
                  <img
                    src={server_url + "images/" + data.image}
                    alt=" "
                    className=" "
                  />
                </div>
                <div className="px-2 py-4">
                  <p className="mt-3">{data.name}</p>
                  <button className="update_button mt-2">Consult Now</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Cards;
