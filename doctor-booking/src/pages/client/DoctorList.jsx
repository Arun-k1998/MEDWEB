import React, { useEffect, useState } from "react";
import Navbar from "../../components/client/navbar/Navbar";
import api from "../../helper/axios/userAxios";
import { useParams } from "react-router-dom";
import DoctorListingCard from "../../components/client/doctorListingCard/DoctorListingCard";
import SearchBar from "../../components/client/SearchBar/SearchBar";
import UserSidbar from "../../components/client/SideBar/UserSidbar";

function DoctorList() {
  const { name } = useParams();
  const [docotrsList, setDoctorsList] = useState([]);
  const [search ,setSearch] = useState('')
  const [value,setValue] = useState('')
  const searchByName = (e)=>{
    
    const search = e.target.value
    setValue(search)
   

  }
  useEffect(()=>{
    if(value){
        api.get(`/doctorSearch/${value}`).then((response)=>{
            if(response.data.status){
             console.log(response.data.doctors);
                setDoctorsList([...response.data.doctors])
            }else{
              
              setDoctorsList([])
            }
        })
    }
  },[value])
  useEffect(() => {
    if( name && !value){
     
        api.get(`/consult/${name}`).then((response) => {
            if (response.data.status) {
              setDoctorsList([...response.data.doctors]);
            }
          });
    }
    
  }, []);

  return (
    <div>
      <div className="h-[10vh] bg-black">
      <Navbar />
      </div>
    
      <div className="w-full border-b-2 border-b-[#189AB4] h-[10vh] flex justify-center items-center">
      {/* <SearchBar value={value} search={searchByName} /> */}
      <h1 className="text-xl">Cosnsult With Our specialist</h1>
      </div>
    
      <div className="grid md:grid-cols-[2fr_7.5fr] h-[80vh]">
      <UserSidbar />
      <DoctorListingCard doctors={docotrsList} />
      </div>
      
    </div>
  );
}

export default DoctorList;
