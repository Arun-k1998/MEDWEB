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


function user() {
  return (
   <div>
      <Routes >
        
        <Route element={ <HomeVerification > <Home /> </ HomeVerification>} path='/' />
        <Route element={<Authorization accessBy={'non-Authorized'}> <UserLogin /> </ Authorization>} path='/login' />
        <Route element={<Authorization accessBy={'non-Authorized'}> <Register /> </ Authorization>} path='/signup' />
        <Route element={ <HomeVerification >  <DoctorList /> </ HomeVerification>} path='/consult/:name' />
        <Route element={<UserProfilePage />} path='/profile/:id' />
        <Route element={ <HomeVerification ><DoctorSinglePage /></HomeVerification> } path='/consult/detail/:doctorId' />
      </Routes>
      </div>
  )
}

export default user