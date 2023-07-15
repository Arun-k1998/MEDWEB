import React from 'react'
import AdminNavbar from '../../components/admin/navbar/AdminNavbar'
import Sidebar from '../../components/admin/sideBar/Sidebar'


function Dashboard() {
 
  return (
    <div className=''>
        <AdminNavbar />
        <div className="grid grid-cols-[1fr_7fr] md:grid-cols-[1.5fr_8.5fr] w-full">
        <Sidebar />
        </div>
    </div>
  )
}

export default Dashboard
