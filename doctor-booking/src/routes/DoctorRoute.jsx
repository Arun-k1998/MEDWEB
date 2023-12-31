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
import AlreadyScheduledPage from '../pages/doctor/AlreadyScheduledPage'
import ScheduledPage from '../pages/doctor/ScheduledPage'
import Prescription from '../pages/doctor/Prescription'
import PaymentsHistoryPage from '../pages/doctor/PaymentsHistoryPage'
import Client404 from '../pages/client/client404Component'
import Chat from '../pages/client/DoctorChat/Chat'

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
        <Route element={<DoctorAuthentication accessBy={'Authorized'} ><ScheduledPage /></DoctorAuthentication>} path='/scheduled_slotes' />
        <Route element={<DoctorAuthentication accessBy={'Authorized'} ><Prescription /></DoctorAuthentication>} path='/prescription/:consultationid' />
        <Route element={<DoctorAuthentication accessBy={'Authorized'} ><Prescription /></DoctorAuthentication>} path='/prescription/:consultationid/update' />
        <Route element={<DoctorAuthentication accessBy={'Authorized'}><PaymentsHistoryPage /> </DoctorAuthentication>} path='/payments' />
        <Route element={<DoctorAuthentication accessBy={'Authorized'}><Chat /></DoctorAuthentication>} path='/chat' />
        <Route element={<Client404 role={'doctor'}  />} path='/*' />
      </Routes>
    </div>
  )
}

export default DoctorRoute
