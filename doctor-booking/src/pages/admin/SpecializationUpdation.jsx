import React from 'react'
import AdminNavbar from '../../components/admin/navbar/AdminNavbar'
import Sidebar from '../../components/admin/sideBar/Sidebar'
import Form from '../../components/admin/specilaizationUpdationForm/SpecializationUpdation'
function SpecializationUpdation() {
  return (
    <div>
        <AdminNavbar />
        <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full">
        <Sidebar />
        <Form />
      </div>
    </div>
  )
}

export default SpecializationUpdation
