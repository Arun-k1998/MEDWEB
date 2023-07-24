import React, { useContext, useEffect, useState } from 'react'
import CreateButton from '../buttons/CreateButton';
import { adminApi } from '../../../helper/axios/adminAxios';
import Card from '../Cards/Card';
import { ToastifyContest } from '../../../helper/contest/ToastifyContest';

function Specialization() {
    const updatePath = '/admin/specialization_u'
    const [data,setData] = useState([])
    const {show} = useContext(ToastifyContest)

    const handleDelete = (id)=>{
      adminApi.post(`/delete_spec/${id}`).then((response)=>{
        if(response.data.status){
          show(response.data.message)
        }
      })
    }

    useEffect(()=>{
        adminApi.get('/specialization').then((response)=>{
            console.log('hello');
            if(response.data.status){
                console.log('hello');
                console.log(response.data.specializations)
                setData(response.data.specializations)
            }
        })
    },[])
  return (
    <div>
         <div className="flex flex-col h-full bg-sky-50 w-full relative">
      <CreateButton content='Specilization' path="/admin/c_specialization"  />
      <div className="mt-36 mx-20 flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
       {
        data.length > 0 ?  data.map((data,index)=> <Card deleteClick={handleDelete} key={index} data={data} updatePath={updatePath}   /> )   : <p>No content</p>
       }
      </div>
      {/* {confrimation && <div className="fixed inset-0 bg-transparent  backdrop-blur-sm  flex justify-center items-center flex-col ">
        <div className="bg-white rounded-lg p-10 flex flex-col justify-center items-center  ">
          <div >
          <h1>Delete</h1>
          </div>
          <div className="mt-3">
            <p>Are you Sure You want to delete</p>
          </div>
          <div className="mt-3">
            <button className="bg-red-600 text-white rounded-lg px-4 py-2" onClick={handleDelete}>Confirm</button>
            <button className="bg-green-700 text-white rounded-lg px-4 py-2 ml-4" onClick={()=> setConfirmation(false)} >Cancel</button>
          </div>
          
        </div>
      </div>} */}
    </div>
    </div>
  )
}

export default Specialization
