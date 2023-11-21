import React, { useEffect, useState } from 'react'
import api from '../../../helper/axios/userAxios'

function Banner() {
    const [banners,setBanners] = useState({})
    const server_url = import.meta.env.VITE_SERVER_URL
    useEffect(()=>{
        api.get('/').then((response)=>{
            if(response.data.status){
                console.log(response.data.banners[0]);
                setBanners({...response.data.banners[0]})
            }
        })
    },[])
  return (
    <div className='my-10 flex justify-center w-full '>

        <div className=' md:h-auto w-full md:w-3/4 rounded-md overflow-hidden '>
            <img src={server_url+'images/'+ banners.image} alt="" className='w-full' />
        </div>
    </div>
  )
}

export default Banner
