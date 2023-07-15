import React from 'react'
import AdminNavbar from '../../components/admin/navbar/AdminNavbar'
import Sidebar from '../../components/admin/sideBar/Sidebar'
import Specialization from '../../components/admin/Specialization/Specialization'
import SpecializationCreation from '../../components/admin/SpecializationCreation/SpecializationCreation'

function SpecializationUpload() {
  return (
    <div>
         <AdminNavbar />
        <div className='grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full'>
            <Sidebar />
            <div className='flex w-full justify-center items-center '>
            <SpecializationCreation />
            </div>
        </div>
    </div>
  )
}

export default SpecializationUpload
