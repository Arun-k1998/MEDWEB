import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../../components/client/navbar/Navbar'

function UserNotificationPage() {
    const {id,notifications}= useSelector(store=>store.user)
    const [usernotifications,setNotifications] = useState([])
    useEffect(()=>{
        if(id){
            setNotifications([...notifications]);
        }
    },[id,notifications])
  return (
    <div>
 <div className="h-[10vh]">
        <Navbar />
      </div>

      {usernotifications?.map((notification)=>{
        return <p>{notification.message}</p>
      })}     

    </div>
  )
}

export default UserNotificationPage
