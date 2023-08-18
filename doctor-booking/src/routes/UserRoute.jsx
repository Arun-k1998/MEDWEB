import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Register from '../pages/client/Signup'
import UserLogin from '../pages/client/Login'
import Home from '../pages/client/Home'
import { HomeVerification } from '../Authentication/user/HomeAuthentication'
import { Authorization } from '../Authentication/user/userAuthentication'
import DoctorList from '../pages/client/DoctorList'
import UserProfilePage from '../pages/client/UserProfilePage'
import DoctorSinglePage from '../pages/client/DoctorSinglePage'
import PaymentSuccessPage from '../pages/client/PaymentSuccessPage'
import AppointmentsPage from '../pages/client/AppointmentsPage'
import VideoMeetPage from '../pages/client/VideoMeetPage'
import Payments from '../pages/client/Payments'
import UserPrescriptionPage from '../pages/client/UserPrescriptionPage'
import UserNotificationPage from '../pages/client/UserNotificationPage'
import PaymentHistory from '../pages/client/paymentHistoryPage'
import Client404 from '../pages/client/client404Component'
import Client500Page from '../pages/client/client500Page'


function user() {
  return (
   <div>
      <Routes >
        <Route element={ <HomeVerification > <Home /> </ HomeVerification>} path='/' />
        <Route element={<Authorization accessBy={'non-Authorized'}> <UserLogin /> </ Authorization>} path='/login' />
        <Route element={<Authorization accessBy={'non-Authorized'}> <Register /></ Authorization>} path='/signup' />
        <Route element={ <HomeVerification >  <DoctorList /> </ HomeVerification>} path='/consult/:name' />
        <Route element={<Authorization accessBy={'Authorized'} ><UserProfilePage /></Authorization>} path='/profile/:id' />
        <Route element={ <HomeVerification ><DoctorSinglePage /></HomeVerification> } path='/consult/detail/:doctorId' />
        <Route element={<Authorization accessBy={'Authorized'} ><AppointmentsPage /></Authorization>} path='/appointments' />
        <Route element={<PaymentSuccessPage />} path='/payment/success' />
        <Route element={<VideoMeetPage />} path='/meet/:id' />
        <Route element={<Authorization accessBy={'Authorized'} ><Payments /></Authorization>} path = '/payments' />
        <Route element={<Authorization accessBy={'Authorized'} ><UserProfilePage /></Authorization>} path='/profile' />
        <Route element={ <Authorization accessBy={'Authorized'} > <UserPrescriptionPage /> </Authorization>  } path='/prescription' />
        <Route element={<Authorization accessBy={'Authorized'} ><UserNotificationPage /></Authorization>} path='/notifications' />
        <Route element={<Authorization accessBy={'Authorized'} ><PaymentHistory /></Authorization>} path='/consultation_history' />
        <Route element={<Client500Page />} path='/500' />
        <Route element={<Client404 />} path='/*' />
      </Routes>
      </div>
  )
}

export default user