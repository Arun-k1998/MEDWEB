import { useDispatch, useSelector } from "react-redux"
import getCookies from "../../helper/getCookie"

import { userLogin,userLogout } from "../../redux/userSlice"
import api from "../../helper/axios/userAxios"
import { useContext, useEffect, useState } from "react"
import { ToastifyContest } from "../../helper/contest/ToastifyContest"


export const HomeVerification = ({children})=>{
    const cookie = getCookies()
    const user = useSelector((store)=> store.user)
    const dispatch = useDispatch()

    const {show} = useContext(ToastifyContest)
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
                }).catch((error) => {
                    console.log('Blocked');
                    const expires = "expires=" + "Thu, 01 Jan 1970 00:00:01 GMT";
                    // Thu, 01 Jan 1970 00:00:01 GMT
                    document.cookie =
                      "userToken=Bearer " + ";" + expires + "; path=/";
                    dispatch(userLogout());
                    show(error.response.data.message,401)
                    setLoading(false)
                  })
            }else{
                setLoading(false)
            }
        })()
    },[loading])
  
    if(!loading) return children
    else return null
}