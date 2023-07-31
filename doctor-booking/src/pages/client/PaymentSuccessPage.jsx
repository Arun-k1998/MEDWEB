import React, { useEffect } from 'react'
import api from '../../helper/axios/userAxios'
import {useLocation} from 'react-router-dom'


function PaymentSuccessPage() {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const session_id = queryParams.get('session_id')
    useEffect(()=>{
      const jwt = localStorage.getItem('myToken')

      
     
    

      api.post ('/payment-succes',{booking:jwt,paymentId:session_id}).then((res)=>{
            alert("success")
            localStorage.removeItem('myToken');
        })

    },[session_id])
  return (
    <div className='w-full h-[100vh] flex flex-col justify-center items-center'>
        <h1 className='text-xl'> Success</h1>
    </div>
  )
}

export default PaymentSuccessPage
