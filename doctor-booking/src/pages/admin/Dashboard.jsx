import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/navbar/AdminNavbar";
import Sidebar from "../../components/admin/sideBar/Sidebar";
import { adminApi } from "../../helper/axios/adminAxios";
import DashBoardComponent from "../../components/admin/DashBoard/DashBoardComponent";
import moment from "moment";

function Dashboard() {
  const [userCount, setUser] = useState(null);
  const [doctorCount, setDoctors] = useState(null);
  const [consultationCount, setConsultationCount] = useState(null);
  const initialValuesOfDays = ['Sunday','Monday','Tuesday',"Wednesday","Thursday",'Friday','Saturday']
  const [days,setDays] = useState(initialValuesOfDays)
  const [dayWiseSales,setDayWiseSales] = useState([])
  const [lineChartFrom,setLineChartFrom] = useState(moment())
  const [lineChartTo,setLineChartTo] = useState(moment().subtract(7,'days'))
  const [lineChartSeries,setLineChartSeries] = useState([{
    name: "Total Amount",
    data: []
}])



  const pieChartSeriesInitial = [];
  const pieChartOptionsInitial = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: [],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };


  const linechartOptionsInitial = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'Weekly Profit',
      align: 'center'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories:days ,
    }
  }

  const [pieChartSeriesDoctor, setPieChartseriesDoctor] = useState(
    pieChartSeriesInitial
  );
  const [pieChartOptionsDoctor, setPieChartOptionsDoctor] = useState(
    pieChartOptionsInitial
  );

  const [pieChartSeriesAdmin,setPieChartSeriesAdmin] = useState(pieChartSeriesInitial)
  const [pieChartOptionsAdmin,setPieChartOptionsAdmin] = useState(pieChartOptionsInitial)

  const formateDate = (date) => {
    let result = moment(date).format("L");
    return result;
  };

  useEffect(() => {
    adminApi
      .get("/dashBoard")
      .then((res) => {
        if (res.data.status) {
          setUser(res.data.userCount);
          setDoctors(res.data.doctorCount);
          setConsultationCount(res.data.consultationCount);
          res.data.pieChartData.forEach((data) => {
            setPieChartseriesDoctor((pre) => [...pre, data["doctorPayment"]]);
            setPieChartSeriesAdmin((pre)=> [...pre,data['adminPayment']])
          });

          res.data.pieChartData.forEach((data) => {
            setPieChartOptionsDoctor((prev) => ({
              ...prev,
              labels: [...prev.labels, data._id], // Corrected syntax here
            }));

            setPieChartOptionsAdmin((prev)=>(
              {
                ...prev,
                labels:[...prev.labels,data._id]
              }
            ))

          });
          let weeklySalesReport = res.data.weeklySalesReport
          
          let newDaysArray = []
          let newArray =[]
          for(let i = 0;i< weeklySalesReport.length;i++){
             newArray.push(weeklySalesReport[i]?.totalAmount) 
            // else newArray.push(null)
            console.log(i);
          }

          weeklySalesReport.forEach((report)=>{
            console.log('report',report._id);
            let formattedDate = formateDate(report._id)
            console.log(formattedDate);
            newDaysArray.push(formattedDate)
          })
          setDays([...newDaysArray])
          console.log('---newArray-----');
          setLineChartSeries(prev=>{
            return [{...prev[0],['data'] : newArray} ]
          })
          setLineChartFrom(res.data.lineChartFrom)
          setLineChartTo(res.data.lineChartTo)
        }
      })
      .catch((error)=>{
        if(error.response){
          show(error.response.data.message,error.response.status)
        }else if(error.request){
          navigate('/500')
        }else{
          console.log(error);
        }
      })
  }, []);
  // console.log(pieChartSeriesDoctor,'pieChartSeriesDoctorrrrr');
  // console.log(pieChartOptionsDoctor,'pieChartOptionsDoctor');
  return (
    <div className='sticky top-0 z-10 h-[12vh] '>
      <AdminNavbar />
      <div className="grid grid-cols-[1fr_7fr] md:grid-cols-[1.5fr_8.5fr] w-full sticky top-[12vh]">
        <Sidebar />
        <div className="w-full h-[88vh]  overflow-y-scroll">
        <DashBoardComponent
          userCount={userCount}
          doctorCount={doctorCount}
          consultationCount={consultationCount}
          pieChartSeriesDoctor={pieChartSeriesDoctor}
          pieChartOptionsDoctor={pieChartOptionsDoctor}
          pieChartSeriesAdmin={pieChartSeriesAdmin}
          pieChartOptionsAdmin={pieChartOptionsAdmin}
          lineChartSeries={lineChartSeries}
          linechartOptionsInitial={linechartOptionsInitial}
          lineChartFrom={lineChartFrom}
          lineCharto={lineChartTo}
          setLineChartFrom={setLineChartFrom}
          setLineChartTo={setLineChartTo}
        />
        </div>
        
      </div>
      
    </div>
  );
}

export default Dashboard;
