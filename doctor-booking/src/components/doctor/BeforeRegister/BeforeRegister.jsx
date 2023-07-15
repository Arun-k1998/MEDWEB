import React from 'react'
import { useNavigate } from 'react-router-dom'

function BeforeRegister() {
    const navigate = useNavigate()
  return (
    <div className='w-full h-full flex justify-center items-center flex-col' >
      <p className='text-lg' >Please complete Registeration for Consultation </p>
      <p className='text-sky-700 underline cursor-pointer' onClick={()=> navigate('/doctor/register')} >Click here </p>
    </div>
  )
}

export default BeforeRegister
