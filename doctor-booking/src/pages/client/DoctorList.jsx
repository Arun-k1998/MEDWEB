import React, { useEffect, useState } from 'react'
import Navbar from '../../components/client/navbar/Navbar'
import api from '../../helper/axios/userAxios'
import { useParams } from 'react-router-dom'
import DoctorListingCard from '../../components/client/doctorListingCard/DoctorListingCard'

function DoctorList() {
    const {name} = useParams()
    const [docotrsList,setDoctorsList] = useState([])
    useEffect(()=>{
        api.get(`/consult/${name}`).then((response)=>{
            if(response.data.status){
                
                setDoctorsList([...response.data.doctors])
            }
        })
    },[])
  return (
    <div>
        <Navbar />
        <DoctorListingCard doctors={docotrsList} />
    </div>
  )
}

export default DoctorList
