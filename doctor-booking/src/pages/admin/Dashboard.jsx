import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../components/admin/navbar/AdminNavbar'
import Sidebar from '../../components/admin/sideBar/Sidebar'
import { adminApi } from '../../helper/axios/adminAxios'
import DashBoardComponent from '../../components/admin/DashBoard/DashBoardComponent'


function Dashboard() {
  const [users,setUser] = useState({})
  const [doctors,setDoctors] = useState({})

  useEffect(()=>{
    adminApi.get('/dashBoard').then((res)=>{
      if(res.data.status){

      }
    }).catch()
  },[])
  return (
    <div className=''>
        <AdminNavbar />
        <div className="grid grid-cols-[1fr_7fr] md:grid-cols-[1.5fr_8.5fr] w-full">
        <Sidebar />
        <DashBoardComponent />
        </div>
    </div>
  )
}

export default Dashboard
