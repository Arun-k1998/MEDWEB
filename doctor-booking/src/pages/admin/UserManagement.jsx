import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../components/admin/navbar/AdminNavbar'
import Sidebar from '../../components/admin/sideBar/Sidebar'
import { adminApi } from '../../helper/axios/adminAxios'

function UserManagement() {
    const [usersList,setUsersList] = useState([{}])
    useEffect(()=>{
        adminApi.get("/user_list").then((res)=>{
            if(res.data.status){
                setUsersList([...res.data.userList])
            }
        })
    })

  return (
    <div>
        <AdminNavbar />
        <div className='grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full'>
            <Sidebar />
            <div className='flex w-full justify-center items-center '>
         
            </div>
        </div>
    </div>
  )
}

export default UserManagement
