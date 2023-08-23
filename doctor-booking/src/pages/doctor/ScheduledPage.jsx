import React, { useEffect, useState } from "react";
import Navbar from "../../components/doctor/Navbar/Navbar";
import Sidebar from "../../components/doctor/Sidebar/Sidebar";
import { useSelector } from "react-redux";
import { doctorApi } from "../../helper/axios/doctorAxios";
import ScheduledTimes from "../../components/doctor/ScheduledTimes/ScheduledTimes";

function ScheduledPage() {
  const doctorId = useSelector((store) => store.doctor.id);
  const [scheduledDates, setScheduledDates] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    doctorApi
      .get(`/timeSlotes?id=${doctorId}&edit=${true}`)
      .then((response) => {
        if (response.data.status) {
          setScheduledDates([...response.data.slotes]);
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
  }, [refresh]);
  return (
    <div>
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>

      <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] ">
        <Sidebar />
        {scheduledDates.length ? (
          <ScheduledTimes
            scheduledDates={scheduledDates}
            setRefresh={setRefresh}
          />
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default ScheduledPage;
