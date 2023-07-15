import React from 'react'
import Navbar from '../../components/admin/navbar/AdminNavbar'
import Sidebar from '../../components/admin/sideBar/Sidebar'
import DrApplications from '../../components/admin/DrApplications/DrApplications'

function DoctorApplicatoins() {
  return (
    <div>
        <Navbar />
        <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full">
        <Sidebar />
        <DrApplications />
      </div>
    </div>
  )
}

export default DoctorApplicatoins
