import { useNavigate } from "react-router-dom";
import getCookies from "../../helper/getCookie";


function AdminVerification({children,accessBy}){
    const navigate = useNavigate()
    const cookie = getCookies()
    if(accessBy =='Authorized'){
        if( !cookie['adminToken']){
            window.location.href = '/admin/login'
        }else{
            return children
        }
    }
    else if(accessBy == 'non-Authorized'){
        if(cookie['adminToken']){
           window.location.href = '/admin/dashboard'
        }else{
            return children
        }
    }
}

export default AdminVerification