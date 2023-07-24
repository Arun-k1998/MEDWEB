import React, { useEffect, useState } from "react";
import Navbar from "../../components/client/navbar/Navbar";
import api from "../../helper/axios/userAxios";
import { useParams } from "react-router-dom";
import DoctorListingCard from "../../components/client/doctorListingCard/DoctorListingCard";
import SearchBar from "../../components/client/SearchBar/SearchBar";

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
      <Navbar />
      <SearchBar value={value} search={searchByName} />
      <DoctorListingCard doctors={docotrsList} />
    </div>
  );
}

export default DoctorList;
