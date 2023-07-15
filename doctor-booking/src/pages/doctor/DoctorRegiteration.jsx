import React from 'react'
import Navbar from '../../components/doctor/Navbar/Navbar'
import Sidebar from '../../components/doctor/Sidebar/Sidebar'
import DocRegisterationForm from '../../components/doctor/RegisterationForm/DocRegisterationForm'

function DoctorRegiteration() {
  return (
    <div>
        <Navbar />
        <div className='grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full' >
            <Sidebar />
            <DocRegisterationForm />
        </div>
    </div>
  )
}

export default DoctorRegiteration
