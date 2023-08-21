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
                }else{
                    window.location.href = '/doctor/login'
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
    },[loading])

    if(accessBy === "Authorized" && !loading){
        // return navigate('/doctor/login')
        return children
    }
    else if(accessBy === "non-Authorized" && !loading ){
        return navigate('/doctor/dashboard')
    }
    else if(accessBy === 'non-Authorized' && loading){
        return children
    }

    return null

}

export default DoctorAuthentication;

