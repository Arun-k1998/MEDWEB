import React, { useEffect,useState } from 'react'
import Navbar from '../../components/client/navbar/Navbar'
import Banner from '../../components/client/Banner/Banner'
import Cards from '../../components/client/Cards/Cards'
import Footer from '../../components/client/Footer/Footer'
import api from '../../helper/axios/userAxios'

function Home() {
  const [specialization,setSpecialization] = useState([])
  useEffect(()=>{
    api.get('/').then((response)=>{
      if(response.data.status){
        console.log(response.data.specialization);
        setSpecialization([...response.data.specialization])

      }
    })
  },[])
  return (
    <div>
      <Navbar />
      <Banner />
      <Cards specialization={specialization} />
      <Footer />
    </div>
  )
}

export default Home
