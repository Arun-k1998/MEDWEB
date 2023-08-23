import React, { useEffect, useState } from "react";
import Navbar from "../../components/doctor/Navbar/Navbar";
import Sidebar from "../../components/doctor/Sidebar/Sidebar";
import PatientsList from "../../components/doctor/Patients/PatientsList";
import { doctorApi } from "../../helper/axios/doctorAxios";
import { useSelector } from "react-redux";

function DoctorPatientsListingPage() {
  const doctorId = useSelector((store) => store.doctor.id);
  const [patients, setPatients] = useState([{}]);
  useEffect(() => {
    if (doctorId)
      doctorApi
        .get(`/patients/${doctorId}`)
        .then((res) => {
          if (res.data.status) {
            setPatients([...res.data.patients]);
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
  }, [doctorId]);
  return (
    <div>
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] ">
        <Sidebar />
        <PatientsList patients={patients} />
      </div>
    </div>
  );
}

export default DoctorPatientsListingPage;
