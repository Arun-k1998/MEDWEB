import React, { useEffect, useState } from "react";
import api from "../../helper/axios/userAxios";
import { useSelector } from "react-redux";
import Navbar from "../../components/client/navbar/Navbar";
import Appointments from "../../components/client/Appointments/Appointments";
import Footer from "../../components/client/Footer/Footer";
import UserPresCription from "../../components/client/Prescription/UserPresCription";
import moment from "moment";
function AppointmentsPage() {
  const [appointments, setAppointments] = useState([{}]);
  const [appointmentsType, setAppointmentsType] = useState("upcoming");
  const userId = useSelector((store) => store.user.id);
  const [presView, setPresView] = useState(false);
  const [prescription,setPrescription] = useState({})
  const [prescriptionState,setPrescriptionState] = useState(false)
  const handlePrescriptionButton = (appointmentId,index)=>{
   
    setPrescription( {...appointments[index]})
    // console.log(appointments[index]);
    setPrescriptionState(prev=>!prev)
  }

  const timChecker = (endingTime) => {
    const timeNow = moment();
    return timeNow.isAfter(moment(endingTime));
  };

  console.log(userId);
  useEffect(() => {
    if (userId) {
      api
        .get(`/appointments/${userId}/${appointmentsType}`)
        .then((response) => {
          if (response.data.status) {
            console.log(response.data.appointments);
            setAppointments([...response.data.appointments]);
          }
        });
    }
  }, [appointmentsType]);
  return (
    <div>
      <div className="h-[10vh] sticky top-0 z-10 ">
        <Navbar />
      </div>
      {!prescriptionState&&<div className="w-full bg-slate-300 h-[90vh] relative">
        <Appointments
          setPresView={setPresView}
          appointments={appointments}
          setAppointmentsType={setAppointmentsType}
          handlePrescriptionButton={handlePrescriptionButton}
        />
      </div>}
      {prescriptionState &&<div className="w-full bg-slate-100 h-[90vh] flex items-center">
      <UserPresCription prescription={prescription} setPrescriptionState={setPrescriptionState} /> 

      </div>}
      <div className="w-full h-[25vh] ">
        <Footer />
      </div>
    </div>
  );
}

export default AppointmentsPage;
