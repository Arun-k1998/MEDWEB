import React from 'react'
import {Routes,Route} from 'react-router-dom'
import AdminLogin from '../pages/admin/Login'
import Bannerpage from '../pages/admin/Bannerpage'
import BannerUpload from '../pages/admin/BannerUpload'
import AdminVerification from '../Authentication/admin/adminAuthentication'
import AdminDashboard from '../pages/admin/Dashboard'
import BannerUpdatePage from '../pages/admin/BannerUpdatePage'
import SpecializationManagement from '../pages/admin/SpecializationManagement'
import SpecializationUpload from '../pages/admin/SpecializationUpload'
import DoctorApplicatoins from '../pages/admin/DoctorApplicatoins'
import DoctorApproval from '../pages/admin/DoctorApproval'

function AdminRoute() {
  return (
    <>
      <Routes>
      <Route element={ <AdminVerification accessBy={'non-Authorized'}><AdminLogin /> </AdminVerification>} path='/login' />
        <Route element={ <AdminVerification accessBy={'Authorized'}> <AdminDashboard /> </AdminVerification>} path='/dashboard' />
        <Route element={<Bannerpage />} path='/banner' />
        <Route element={<SpecializationManagement />} path='specialization' />
        <Route element={<BannerUpload />} path='/create_banner' />
        <Route element={<BannerUpdatePage />} path='/banner_u/:id' />
        <Route element={<SpecializationUpload />} path='/c_specialization' />
        <Route element={<DoctorApplicatoins />} path='/applications' />
        <Route element={<DoctorApproval />} path='/dr_approval/:id' />
      </Routes>
    </>
  )
}

export default AdminRoute
