
import getCookie from "../../helper/getCookie";
import {userLogin, userLogout} from '../../redux/userSlice'
import {useDispatch, useSelector } from "react-redux";
import getCookies from "../../helper/getCookie";
import { useNavigate } from "react-router-dom";
import api from "../../helper/axios/userAxios";



export const Authorization = ({children,accessBy})=>{
    const user = useSelector((state)=> state.user.id)
    const dispatch = useDispatch()
    const cookie = getCookies()
    const navigate = useNavigate()
    ;
    if(accessBy == 'non-Authorized'){
        if( !cookie['userToken'] ){
            return children
        }else if(cookie['userToken']){
            api.get('/token_v').then((response)=>{
                if(response.data.user){
                   dispatch(userLogin(response.data.user))
                   return children
                    // navigate('/')
                }
            })          
            // window.location.href = '/'
        }
    }
    else if(accessBy == 'Authorized'){
        if(user) return children
        else if(cookie && cookie['userToken']){
            api.get('/token_v').then((response)=>{
                if(response.data.user){
                   dispatch(userLogin(response.data.user))
                   return children
                }
            })   
        }else{
            window.location.href = '/'
        }
    }
}