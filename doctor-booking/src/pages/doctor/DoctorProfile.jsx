import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doctorApi } from '../../helper/axios/doctorAxios'

function DoctorProfile() {
    const {id} = useParams()
    const [doctor,setDoctor] = useState({})
    const {VITE_SERVER_URL} = import.meta.env
    const [image,setImage] = useState('')
    const onImageChange = (e)=>{
        setImage(e.target.files[0])
    }

    const handleSubmit = ()=>{
        const form = new FormData()
    
        form.append('image',image)
        form.append('id',doctor._id)
        doctorApi.post('/profile',form,{
            headers: {
              "content-type": "multipart/form-data",
            },
          })
    }
    useEffect(()=>{
        if(id){
            doctorApi.get(`/profile/${id}`).then((response)=>{
                if(response.data.status){
                    setDoctor({...response.data.doctor})
                }
            })
        }
        
    },[id])
  return (
    <div>
      <img  src={`${VITE_SERVER_URL}/images/${doctor.image}`} alt="" />
      <input type="file" name='image' onChange={onImageChange} />
    <button onClick={handleSubmit}>update</button>
    </div>
  )
}

export default DoctorProfile
