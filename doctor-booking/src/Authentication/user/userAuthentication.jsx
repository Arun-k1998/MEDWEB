import getCookie from "../../helper/getCookie";
import { userLogin, userLogout } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import getCookies from "../../helper/getCookie";
import { useNavigate } from "react-router-dom";
import api from "../../helper/axios/userAxios";
import { useEffect, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";


export const Authorization = ({ children, accessBy }) => {
  const user = useSelector((state) => state.user.id);
  const dispatch = useDispatch();
  const cookie = getCookies();
  const navigate = useNavigate();
 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (function () {
      if (accessBy == "Authorized") {
        if (user) {
            // alert('HI')
            setLoading(false);

        }
        else if (cookie && cookie[" userToken"]) {
            
          api.get("/token_v").then((response) => {
            if (response.data.status) {
                
                dispatch(userLogin(response.data.user));
                setLoading(false);
            }
          });
        } else {
          window.location.href = "/";
        }
      }
      else if(accessBy == "non-Authorized") {
            // if (!cookie["userToken"]) {
            //   return children;
            // }
            if(user){
                alert('login')
                setLoading(false)
            }
             else if (cookie[" userToken"]) {
              api.get("/token_v").then((response) => {
                if (response.data.user) {
                  dispatch(userLogin(response.data.user));
                  setLoading(false)
                  // navigate('/')
                }
              });
              // window.location.href = '/'
            }}
          }
    )();
  }, []);

  if (!loading && accessBy == "Authorized"){
   
    return children;
  } 
  else if(!loading && accessBy == "non-Authorized"){
    console.log(!!loading);
    console.log(accessBy == "non-Authorized");
    alert('hiibbib')
    navigate('/')
  } else if(loading && accessBy == "non-Authorized"){
    return children
  }
//   else {
//     return navigate("/login")
//     }
    // 
};
