import { useEffect, useState } from "react";
import getCookies from "../../helper/getCookie";
import { useDispatch, useSelector } from "react-redux";
import { doctorApi } from "../../helper/axios/doctorAxios";
import { doctorLogin } from "../../redux/doctorSlice";
import { useNavigate } from "react-router-dom";



function DoctorAuthentication({children,accessBy}){
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading,setLoading] = useState(true)
    
    const {id} = useSelector(store=> store.doctor)

    useEffect(()=>{
        const verification = async()=>{
            const cookie = getCookies()
            if(accessBy === 'Authorized'){
                if(id) setLoading(false)
                else if(cookie && cookie['doctorToken']){
                    const response = await doctorApi.get('/token_v')
                    if(response.data.status){
                        console.log('all done');
                        dispatch(doctorLogin(response.data.doctor))
                        setLoading(false)
                    }
                }
                
            }else if(accessBy = 'non-Authorized'){
                if(id) setLoading(false)
                else if(cookie && cookie['doctorToken']){
                    const response = await doctorApi.get('/token_v')
                    if(response.data.status){
                        dispatch(doctorLogin(response.data.doctor))
                        setLoading(false)
                    }
                }
            }
        }
        verification()
    },[])

    if(accessBy === "Authorized" && loading){
        return null
    }
    else if(accessBy === "non-Authorized" && !loading ){
        return navigate('/doctor/dashboard')
    }

    return children

}

export default DoctorAuthentication;

