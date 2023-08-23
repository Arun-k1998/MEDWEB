import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/doctor/Navbar/Navbar";
import Sidebar from "../../components/doctor/Sidebar/Sidebar";
import { doctorContext } from "../../helper/contest/DoctorContext";
import BeforeRegister from "../../components/doctor/BeforeRegister/BeforeRegister";
import { useSelector } from "react-redux";
import DoctorDashBoard from "../../components/doctor/DashBoard/DoctorDashBoard";
import { doctorApi } from "../../helper/axios/doctorAxios";
import moment from "moment";

function DoctorDashboardPage() {
  const { approved, id } = useSelector((store) => store.doctor);
  const [weeklyPatientCount, setWeeklyPatientCount] = useState(null);
  const [monthlyPatientCount, setMonthlyPatientCount] = useState(null);
  const [YearlyPatientCount, setYearlyPatientCount] = useState(null);
  const [totalCounsultationDetails, setTotalCounsultationDetails] = useState(
    {}
  );
  const [startingDate, setStartinDate] = useState(
    moment().subtract(7, "days").toDate()
  );
  const [endingDate, setEndingDate] = useState(moment().toDate());

  const [lineChartSeries, setLineChartSeries] = useState([
    {
      name: "Desktops",
      data: [],
    },
  ]);

  const [lineChartOptions, setLineChartOptions] = useState({
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Product Trends by Month",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: [],
    },
  });

  useEffect(() => { //filling dashboard datas
    if (id) {
      doctorApi
        .get(`/dashBoard/${id}`)
        .then((res) => {
          if (res.data.status) {
            setWeeklyPatientCount(res.data.weeklyPatientCount);
            setMonthlyPatientCount(res.data.monthlyPatientCount);
            setYearlyPatientCount(res.data.YearlyPatientCount);
            setTotalCounsultationDetails({
              count: res.data.totalCounsultation[0].count,
              totalAmount: res.data.totalCounsultation[0].totalAmount,
            });
            setStartinDate(res.data.weeklyReportStartingDate);
            setEndingDate(res.data.weeklyReportEndingDate);

            let dateArray = [];
            let start = moment(res.data.weeklyReportStartingDate).valueOf();
            let end = moment(res.data.weeklyReportEndingDate).valueOf();
            console.log(start);
            console.log(end);
            // Your loop to generate dateArray
            for (let i = end; i <= start; i += 24 * 60 * 60 * 1000) {
              let date = moment(i).toDate();
              console.log(date);
              dateArray.push(date);
            }
            console.log(dateArray);
            const dateStrings = dateArray.map((date) => date.toISOString());
            console.log(dateStrings);

            // Assuming res.data.weeklyReport is the array you want to process
            let dateToAmountMap = new Map();
            res.data.weeklyReport.forEach((date) => {
              dateToAmountMap.set(
                moment(date._id).toDate().toISOString(),
                date.totalAmount
              );
            });
            console.log(dateToAmountMap);
            // Creating the seriesArray based on dateArray and dateToAmountMap
            let seriesArray = dateStrings.map((date) => {
              if (dateToAmountMap.has(date)) {
                return dateToAmountMap.get(date);
              } else {
                return null;
              }
            });

            console.log(seriesArray);

            console.log("seriesArray", seriesArray);

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
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full">
        <Sidebar />
        <div className="w-full h-[88vh]  overflow-y-scroll">
          {approved === "approved" ? (
            <DoctorDashBoard
              weeklyPatientCount={weeklyPatientCount}
              monthlyPatientCount={monthlyPatientCount}
              YearlyPatientCount={YearlyPatientCount}
              totalCounsultationDetails={totalCounsultationDetails}
              startingDate={startingDate}
              endingDate={endingDate}
              setStartinDate={setStartinDate}
              setEndingDate={setEndingDate}
              lineChartOptions={lineChartOptions}
              lineChartSeries={lineChartSeries}
            />
          ) : (
            <BeforeRegister />
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboardPage;
