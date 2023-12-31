import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../helper/axios/adminAxios";
import {MdOutlineDelete} from 'react-icons/md'
import {GrUpdate} from 'react-icons/gr'
import CreateButton from "../buttons/CreateButton";
import Card from "../Cards/Card";
function Banner() {
  const navigate = useNavigate();
  const [banner, setBanner] = useState([]);
  const [confrimation,setConfirmation] = useState(false)
  const [bannerId,setBannerId] = useState('')
  const [fetch,setFetch] = useState(false)

  const handleDelete = ()=>{
    console.log('delete');
    console.log(bannerId);
    adminApi.delete('/banner',{data:{id:bannerId}}).then((response)=>{
      if(response.data.status){
        setFetch(!fetch)
        // navigate('/admin/banner')
        
      }
    })
    setConfirmation(false)

  }
  const deleteClick = (id)=>{
    console.log(id);
    setBannerId(id)
    setConfirmation(true)
  }

  useEffect(() => {
    adminApi.get("/banner").then((response) => {
      //    console.log(response.data.banners);
      let newData = response.data.banners.map((bannerdoc) => bannerdoc);
      setBanner([...newData]);
    });
  }, [fetch]);
  return (
    <div className="flex flex-col bg-sky-50 w-full relative">
      <CreateButton content='banner' path="/admin/create_banner"  />
      <div className="mt-36 ml-20 flex grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {banner.map((data, index) => {
          return (
            <Card key={index} data={data} updatePath={'/admin/banner_u'} deleteClick={deleteClick}  />
            // <div
            //   className="rounded-xl bg-white w-full truncate p-2 shadow-lg"
            //   key={index}
            // >
            //   <img
            //     className=" bg-fit rounded-xl"
            //     src={`http://localhost:4001/images/${data.image}`}
            //     alt=""
            //   />
            //   <h1>{data.name}</h1>
            //   <p>{data.description}</p>
            //   <div className="flex justify-center flex-col w-full ">
            //     <button className="bg-sky-500 p-2 rounded-lg mt-3 hidden sm:block" onClick={()=>deleteClick(data._id)} >Delete</button>
            //     <button className="bg-sky-500 p-2 rounded-lg mt-3 hidden sm:block" onClick={()=> navigate(`/admin/banner_u/${data._id}`)}>Update</button>
            //     <button  className="bg-sky-500 p-2 rounded-lg mt-3 block sm:hidden flex justify-center"><MdOutlineDelete /></button>
            //     <button className="bg-sky-500 p-2 rounded-lg mt-3 block sm:hidden flex justify-center"> <GrUpdate /></button>
            //   </div>
            // </div>
          );
        })}
      </div>
      {confrimation && <div className="fixed inset-0 bg-transparent  backdrop-blur-sm  flex justify-center items-center flex-col ">
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
      </div>}
    </div>
  );
}

export default Banner;
