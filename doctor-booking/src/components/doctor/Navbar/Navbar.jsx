import React from 'react'
import icon from '../../../assets/logo/adminmedweblogo.png'
import { useNavigate } from 'react-router-dom';
import {MdOutlineNotifications} from 'react-icons/md'
import { useSelector } from 'react-redux';



function  Navbar() {
    const {id} = useSelector(store=>store.doctor)
    const navigate = useNavigate()
    function logOut(){
       alert('logout')
       const expires = "expires=" + 'Thu, 01 Jan 1970 00:00:01 GMT';
       // Thu, 01 Jan 1970 00:00:01 GMT
       document.cookie =
       "doctorToken=Bearer "+";" + expires + "; path=/doctor";;
        navigate('/doctor/login')
        
     }
     return (
       <div className='grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr]  items-center h-[12vh] sticky top-0 z-10 '>
           <div className='w-full h-full py-4 bg-[#189AB4] px-2 md:px-9 '>
               <img src={icon} alt="" />
           </div>
           <div className='flex flex-row justify-end h-full items-center py-4 bg-[#D4F1F4] shadow-lg px-9 '>
           <div className='cursor-pointer' >
            <p onClick={()=> navigate(`/doctor/profile/${id}`)}>Profile</p>
           </div>
               <MdOutlineNotifications className='mt-1 sm:mt-3 md:mt-1' />
               <button className=' bg-slate-300 p-2 rounded-lg ml-6' onClick={logOut} >Logout</button>
           </div>
           
       </div>
     )
    }

export default Navbar
