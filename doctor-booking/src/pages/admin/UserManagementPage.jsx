import React, { useContext, useEffect, useState } from 'react'
import AdminNavbar from '../../components/admin/navbar/AdminNavbar'
import Sidebar from '../../components/admin/sideBar/Sidebar'
import { adminApi } from '../../helper/axios/adminAxios'
import UserManagement from '../../components/admin/UserManagement/UserManagement'
import { ToastifyContest } from '../../helper/contest/ToastifyContest'

function UserManagementPage() {

    const [userBlock,setUserBlock] = useState(false)
    const {show} = useContext(ToastifyContest)
    
    const handleClick = (action,userId)=>{
    
    adminApi.post(`/user_b/${action}/${userId}`).then((res)=>{
        if(res.data.status){
          
            setUserBlock(prev => !prev)
            show(res.data.message)
        }
    })
  }
                      
    const [usersList,setUsersList] = useState([{}])
    useEffect(()=>{
        adminApi.get("/user_list").then((res)=>{
            if(res.data.status){
                setUsersList([...res.data.userList])
                
            }
        })
    },[userBlock])

  return (
    <div>
        <AdminNavbar />
        <div className='grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full'>
            <Sidebar />
            <div className='flex w-full justify-center items-center '>
           <UserManagement userList={usersList} handleClick={handleClick} />
            </div>
        </div>
    </div>
  )
}

export default UserManagementPage
