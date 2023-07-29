import React from 'react'
import Navbar from '../../components/doctor/Navbar/Navbar'
import Sidebar from '../../components/doctor/Sidebar/Sidebar'
import ConsultationListing from '../../components/doctor/ConsultaionListing/ConsultationListing'

function DoctorConsultaionPage() {
  return (
    <div>
        <div className='sticky top-0 z-10'>
        <Navbar />

        </div>
      
      <div className='grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] ' >
      <Sidebar />
      <ConsultationListing />
      </div>
    </div>
  )
}

export default DoctorConsultaionPage
