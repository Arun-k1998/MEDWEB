import React, { useEffect, useState } from 'react'
import api from '../../helper/axios/userAxios'
import { useSelector } from 'react-redux'
import Navbar from '../../components/client/navbar/Navbar'
import Appointments from '../../components/client/Appointments/Appointments'
import Footer from '../../components/client/Footer/Footer'

function AppointmentsPage() {

    const [appointments,setAppointments] = useState([{}])

    const userId = useSelector(store=> store.user.id)
console.log(userId);
    useEffect(()=>{
        if(userId){
            
            api.get(`/appointments/${userId}`).then((response)=>{
                if(response.data.status){
                    console.log(response.data.appointments);
                    setAppointments([...response.data.appointments])
                }
            })

        }
    },[])
  return (
    <div>
   
    <div className='h-[10vh] sticky top-0 z-10 '>
    <Navbar />
    </div>
    <div className='w-full bg-slate-300 h-[90vh] '>
    <Appointments appointments={appointments} />
    </div>

    <div className='w-full h-[25vh]'>
        <Footer />
    </div>
       
    </div>
  )
}

export default AppointmentsPage
