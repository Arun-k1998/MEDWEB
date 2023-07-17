import React, { useContext } from 'react'
import Navbar from '../../components/doctor/Navbar/Navbar'
import Sidebar from '../../components/doctor/Sidebar/Sidebar'
import { doctorContext } from '../../helper/contest/DoctorContext'
import BeforeRegister from '../../components/doctor/BeforeRegister/BeforeRegister'
import { useSelector } from 'react-redux'

function DoctorDashboard() {
  const {approved} = useSelector(store => store.doctor)

  return (
    <div>
      <Navbar />
      <div className='grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full' >
      <Sidebar />
      {approved === 'approved'? <p>succes</p> : <BeforeRegister />  }
      </div>
    </div>
  )
}

export default DoctorDashboard
