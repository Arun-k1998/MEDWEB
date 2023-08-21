import React from 'react'
import Navbar from '../../components/admin/navbar/AdminNavbar'
import Sidebar from '../../components/admin/sideBar/Sidebar'
import DrApplicationDetalis from '../../components/admin/DrApplicationDetails/DrApplicationDetalis'

function DoctorApproval() {
  return (
    <div>
        <Navbar />
        <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full">
        <Sidebar />
        <div className='flex justify-center items-center bg-sky-50 h-[88vh]' >
        <DrApplicationDetalis />
        </div>
       
      </div>
    </div>
  )
}

export default DoctorApproval
