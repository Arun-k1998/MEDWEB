import React, { useEffect , useState} from 'react'
import { useSelector } from 'react-redux'
import api from '../../helper/axios/userAxios'
import PaymentHistory from '../../components/client/PaymentHistory/PaymentHistory'
import UserProfileSideBar from '../../components/client/UserProfileSideBar/UserProfileSideBar'
import Navbar from '../../components/client/navbar/Navbar'
import Login from '../admin/Login'

function paymentHistoryPage() {

    const [user,setUser]= useState({})
    const userId = useSelector((store)=> store.user.id)
    const [paymentHistory,setPaymentHistory] = useState([{}])
    const [image,setImage] = useState("")

    useEffect(()=>{

        
        

        api.get(`/paymentHistory/${userId}`).then((res)=>{
            if(res.data.status){
                setUser({...res.data.userData})
                setPaymentHistory([...res.data.paymentHistory])
                
            }
        })
    },[])


  return (
    <div>
      <div className="h-[10vh]">
        <Navbar />
      </div>        

      <div className=" h-[100vh] grid grid-cols-[3fr_7fr] gap-3 ">
        <div className="w-full h-full ">
          <UserProfileSideBar  user={user} setImage={setImage} />
        </div>
        <div className="w-full h-full my-auto ">
          <PaymentHistory paymentHistory={paymentHistory} />
        </div>
      </div>
    </div>
  )
}

export default paymentHistoryPage
