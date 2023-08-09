import React, { useEffect, useState } from 'react'
import Navbar from '../../components/client/navbar/Navbar'
import DoctorDetails from '../../components/client/DoctorDetails/DoctorDetails'
import Footer from '../../components/client/Footer/Footer'


function DoctorSinglePage() {
    
  return (
    <div>
     <div className=" w-full h-[10vh] sticky top-0 z-10 ">
      <Navbar />
      </div>
      <div className='w-full  md:h-[90vh] '>
        <DoctorDetails />
      </div>
    <div >
        <Footer />
    </div>
    </div>
  )
}

export default DoctorSinglePage
