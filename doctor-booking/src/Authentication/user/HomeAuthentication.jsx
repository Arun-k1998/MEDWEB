import { useDispatch, useSelector } from "react-redux"
import getCookies from "../../helper/getCookie"

import { userLogin } from "../../redux/userSlice"
import api from "../../helper/axios/userAxios"
import { useEffect, useState } from "react"


export const HomeVerification = ({children})=>{
    const cookie = getCookies()
    const user = useSelector((store)=> store.user)
    const dispatch = useDispatch()
    console.log(cookie);
    // if(user.id){
       
    //     return children
    // }
    // else if(cookie && cookie[' userToken']){
        
    //     api.get('/token_v').then((response)=>{
    //         if(response.data.user){
    //             console.log(response.data.user);
    //             dispatch(userLogin(response.data.user))
    //             return children
    //         }else if(response.status == 401) console.log(response);
    //     })
    // }else{
       
    //     return children
    // }

    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        (function(){
            if(user.id){
       
                return setLoading(false)
            }
            else if(cookie && cookie[' userToken']){
               
                api.get('/token_v').then((response)=>{
                    if(response.data.user){
                        
                        console.log('----------',response.data.user);
                        dispatch(userLogin(response.data.user))
                        return setLoading(false)
                    }else if(response.status == 401) console.log(response);
                })
            }       
        })()
    },[])

    if(!loading) return children
    else return null
}