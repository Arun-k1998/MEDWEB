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
import SpecializationUpdation from '../pages/admin/SpecializationUpdation'

function AdminRoute() {
  return (
    <>
      <Routes>
      <Route element={ <AdminVerification accessBy={'non-Authorized'}><AdminLogin /> </AdminVerification>} path='/login' />
        <Route element={ <AdminVerification accessBy={'Authorized'} > <AdminDashboard /> </AdminVerification>} path='/dashboard' />
        <Route element={ <AdminVerification accessBy={'Authorized'}> <Bannerpage /> </AdminVerification> } path='/banner' />
        <Route element={<AdminVerification accessBy={'Authorized'}><SpecializationManagement /></AdminVerification>} path='specialization' />
        <Route element={<AdminVerification accessBy={'Authorized'}><BannerUpload /></AdminVerification>} path='/create_banner' />
        <Route element={<AdminVerification accessBy={'Authorized'}><BannerUpdatePage /></AdminVerification>} path='/banner_u/:id' />
        <Route element={<AdminVerification accessBy={'Authorized'}><SpecializationUpload /></AdminVerification>} path='/c_specialization' />
        <Route element={<AdminVerification accessBy={'Authorized'}><DoctorApplicatoins /></AdminVerification>} path='/applications' />
        <Route element={<AdminVerification accessBy={'Authorized'}> <DoctorApproval /> </AdminVerification> } path='/dr_approval/:id' />
        <Route element={<AdminVerification accessBy={'Authorized'}> <SpecializationUpdation /></AdminVerification>} path='/specialization_u/:name' />
      </Routes>
    </>
  )
}

export default AdminRoute
