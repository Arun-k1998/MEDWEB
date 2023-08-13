import React, { useEffect, useState } from "react";
import Sidebar from "../../components/doctor/Sidebar/Sidebar";
import Navbar from "../../components/doctor/Navbar/Navbar";
import PaymentHistory from "../../components/doctor/PaymentsHistory/PaymentHistory";
import { useSelector } from "react-redux";
import { doctorApi } from "../../helper/axios/doctorAxios";

function PaymentsHistoryPage() {
  const [bookings, setBookings] = useState([]);
    const {id} = useSelector(store => store.doctor)

  useEffect(()=>{
if(id){
    doctorApi.get(`/allConsultation/${id}`).then((res)=>{
        if(res.data.status){
            console.log(res.data.bookings);
            setBookings([...res.data.bookings])
        }
    })
}
  },[])
  return (
    <div>
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>

      <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] ">
        <Sidebar />
        <PaymentHistory bookings={bookings} />
      </div>
    </div>
  );
}

export default PaymentsHistoryPage;
