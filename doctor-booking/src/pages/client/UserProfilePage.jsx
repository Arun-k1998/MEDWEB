import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../helper/axios/userAxios'

function UserProfilePage() {
    const {id} = useParams()
    // useEffect(()=>{
    //     if(id){
    //         api.get('/profile')
    //     }
    // },[id])
  return (
    <div>
      
    </div>
  )
}

export default UserProfilePage
