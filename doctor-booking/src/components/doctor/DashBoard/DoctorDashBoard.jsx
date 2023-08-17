import React, { useState } from "react";
import profit from "../../../assets/doctorDashboard/profit2.webp";
import patient from "../../../assets/doctorDashboard/patients.webp";
import weekconsultation from "../../../assets/doctorDashboard/doctorDashboardWeek.webp";
import ReactDatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import ReactApexChart from 'react-apexcharts'

function DoctorDashBoard({
  weeklyPatientCount,
  monthlyPatientCount,
  YearlyPatientCount,
  totalCounsultationDetails,
  startingDate,
  endingDate,
  setStartinDate,
  setEndingDate,
  lineChartSeries,
  lineChartOptions
}) {
  let date = "2023-08-13T18:30:00.000+00:00";

  const [fromDate, setFromDate] = useState(moment(startingDate).toDate());
  const [endDate, setEndDate] = useState(moment(endingDate).toDate());

  const handleCalendarClose = () => console.log("Calendar closed");
  const handleCalendarOpen = () => console.log("Calendar opened");
const formateDate  = (date)=>{
    let newDate= moment(date).toDate()
    return newDate
}
  return (
    <div className="w-full h-auto px-5 py-5 dashboard">
      <div className="w-fll  grid grid-cols-3 h-44">
        <div className="w-96 h-full mx-auto bg-white shadow-xl shadow-slate-400 flex items-center p-2 rounded-lg ">
          <div className="w-32 h-32 via-gray-800 rounded-lg overflow-hidden ">
            <img
              src={weekconsultation}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-center justify-around w-64 py-2 h-full">
            <h1 className="text-xl font-semibold tracking-wider">
              Weekly Consultation
            </h1>
            <p className="text-xl font-semibold tracking-wider">
              {weeklyPatientCount}
            </p>
          </div>
        </div>

        <div className="w-96 h-full mx-auto bg-white shadow-xl shadow-slate-400 flex items-center p-2 rounded-lg ">
          <div className="w-32 h-32 via-gray-800 rounded-lg overflow-hidden ">
            <img src={patient} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-center justify-around w-64 py-2 h-full">
            <h1 className="text-xl font-semibold tracking-wider">
              Total Patient
            </h1>
            <p className="text-xl font-semibold tracking-wider">
              {totalCounsultationDetails.count}
            </p>
          </div>
        </div>

        <div className="w-96 h-full mx-auto bg-white shadow-xl shadow-slate-400 flex items-center p-2 rounded-lg ">
          <div className="w-32 h-32 via-gray-800 rounded-lg overflow-hidden ">
            <img src={profit} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col items-center justify-around w-64 py-2 h-full">
            <h1 className="text-xl font-semibold tracking-wider">
              Total Profit
            </h1>
            <p className="text-xl font-semibold tracking-wider">
              {totalCounsultationDetails.totalAmount}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full flex  h-[25rem] bg-slate-500 my-10">
        <div>
          <label htmlFor="">
            From
            <ReactDatePicker
              selected={formateDate(startingDate)}
              onChange={(date) => setStartinDate(date)}
              onCalendarClose={handleCalendarClose}
              onCalendarOpen={handleCalendarOpen}
            />
          </label>
        </div>
        <div>
          <label htmlFor="">
            To
            <ReactDatePicker
              selected={formateDate(endingDate)}
              onChange={(date) => setEndingDate(date)}
              onCalendarClose={handleCalendarClose}
              onCalendarOpen={handleCalendarOpen}
            />
          </label>
        </div>
        <div>
          <button className="bg-slate-900 text-white p-2 mx-10 rounded-lg">
            Submit
          </button>
        </div>
      </div>
      <div>
      <ReactApexChart options={lineChartOptions} series={lineChartSeries} type="line" height={350} />

    
      </div>
    </div>
  );
}

export default DoctorDashBoard;
