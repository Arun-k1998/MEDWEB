import React from 'react'
import { Routes,Route } from 'react-router-dom'
import DoctorSignup from '../pages/doctor/DoctorSignup'
import DoctorLogin from '../pages/doctor/DoctorLogin'
import DoctorDashboard from '../pages/doctor/DoctorDashboard'
import DoctorRegiteration from '../pages/doctor/DoctorRegiteration'
import TimeSchedulingPage from '../pages/doctor/TimeSchedulingPage'
import DoctorAuthentication from '../Authentication/doctor/DoctorAuthentication'
import DoctorProfile from '../pages/doctor/DoctorProfile'
import DoctorConsultaionPage from '../pages/doctor/DoctorConsultaionPage'
import DoctorVideoMeetPage from '../pages/doctor/DoctorVideoMeetPage'
import DoctorPatientsListingPage from '../pages/doctor/DoctorPatientsListingPage'


function DoctorRoute() {
  return (
    <div>
      <Routes>
        <Route element={<DoctorAuthentication accessBy={'non-Authorized'}> <DoctorSignup /></DoctorAuthentication>} path='/signup'  />
        <Route element={<DoctorAuthentication accessBy={'non-Authorized'} ><DoctorLogin /></DoctorAuthentication>} path='/login' />
        <Route element={<DoctorAuthentication accessBy={'Authorized'} ><DoctorDashboard /></DoctorAuthentication>} path='/dashboard' />
        <Route element={<DoctorAuthentication accessBy={'Authorized'} ><DoctorRegiteration /></DoctorAuthentication>} path='/register' />
        <Route element={<DoctorAuthentication accessBy={'Authorized'} ><TimeSchedulingPage /></DoctorAuthentication>} path='/schedule' />
        <Route element={<DoctorAuthentication accessBy={'Authorized'} ><DoctorConsultaionPage /></DoctorAuthentication>} path='/consultation' />
       <Route element={<DoctorAuthentication accessBy={'Authorized'} ><DoctorProfile /></DoctorAuthentication>} path='/profile/:id' />
       <Route element={<DoctorVideoMeetPage />} path='/meet/:id' />
       <Route element={<DoctorAuthentication accessBy={'Authorized'} ><DoctorPatientsListingPage /></DoctorAuthentication>} path='/patients' />
      </Routes>
    </div>
  )
}

export default DoctorRoute
