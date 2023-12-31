import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../../helper/axios/adminAxios'
function BannerUpdation() {
    const navigate = useNavigate()    
    const [banner,setBanner] = useState(false)
    const [name,setname] = useState('')
    const [description,setDescription] = useState('')
    const [image,setImage] = useState('')
    const {id} = useParams()
    const initialValues = {
        name:"",
        description:"",
        image:"",
    }
    // const [formValues,setFormValues]= useState(initialValues)

    const handleSubmit = ()=>{
        const form = new FormData()
        form.append('name',name)
        form.append('description',description)
        form.append('image',image)
        form.append('_id',id)
        adminApi.post('/banner_u', form, {
            headers: {
              "content-type": "multipart/form-data",
            },
          }).then((response)=>{
            if(response.data.status){
                alert('Successfully Updated')
                navigate('/admin/banner')
            }
          })
    }

    useEffect(()=>{
        adminApi.get(`/banner_u/${id}`).then((response)=>{
            if(response.data.status){
               setname(response.data.banner.name)
               setDescription(response.data.banner.description)
               setImage(response.data.banner.image)
            }
        })
    },[])

  return (
    <div className="w-3/4 bg-white p-11 rounded-3xl h-3/4 shadow-lg grid grid-cols-2 md:grid-cols-3 gap-4 ">
      <div className="flex flex-col h-full">
        <input
          type="text"
          placeholder="name"
          className="p-4 mt-4 shadow-lg rounded-lg "
          value={name}
          onChange={(e)=> setname(e.target.value)}
       
        />
        <input
          type="file"
          name="image"
          className="p-2 mt-4 shadow-lg rounded-lg"
          
        />
        <textarea
          type="text"
          placeholder="Description"
          className="p-2 mt-4 shadow-lg h-1/3 rounded-lg"
          value={description}
          onChange={(e)=> setDescription(e.target.value)}
        />
        <button
          className="p-2 mt-4 bg-sky-400 w-2/4 rounded-3xl mx-auto"  
          onClick={handleSubmit}
        >
          Update
        </button>
      </div>
      <div className="flex flex-col md:col-span-2 ">
        <div className="flex flex-col text-center justify-center border-2 mx-20 h-72 px-10 py-6 ">
        {banner && <img
          className="w-full h-full    rounded-lg  "
          src={`http://localhost:4001/images/${image}`}
          alt=""
        />}
      {!banner &&
      (<>
        <p>preview</p>
      <img
          className="w-full h-full    rounded-lg  "
          src={`http://localhost:4001/images/${image}`}
          alt=""
        /></>)}
        </div>
       
      </div>
    </div>
  )
}

export default BannerUpdation
