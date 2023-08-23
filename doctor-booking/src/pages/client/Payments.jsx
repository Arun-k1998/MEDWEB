import React, { useEffect, useState } from "react";
import Navbar from "../../components/client/navbar/Navbar";
import { useSelector } from "react-redux";
import UserPayments from "../../components/client/UserPayments/UserPayments";
import api from "../../helper/axios/userAxios";

function Payments() {
  const userId = useSelector((store) => store.user.id);
  const [appointments, setAppointments] = useState([{}]);

  useEffect(() => {
    if (userId) {
      api
        .get(`/appointments/${userId}`)
        .then((response) => {
          if (response.data.status) {
            setAppointments([...response.data.appointments]);
          }
        })
        .catch((error) => {
          if (error.response) {
            show(error.response.data.message, error.response.status);
          } else if (error.request) {
            navigate("/500");
          } else {
            console.log(error);
          }
        });
    }
  }, [userId]);

  return (
    <div>
      <div className="h-[10vh] sticky top-0 z-10 ">
        <Navbar />
      </div>
      <div>
        <UserPayments appointments={appointments} />
      </div>
    </div>
  );
}

export default Payments;
