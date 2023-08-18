import getCookie from "../../helper/getCookie";
import { userLogin, userLogout } from "../../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import getCookies from "../../helper/getCookie";
import { useNavigate } from "react-router-dom";
import api from "../../helper/axios/userAxios";
import { useContext, useEffect, useState } from "react";
import { FaAnglesRight } from "react-icons/fa6";
import { ToastifyContest } from "../../helper/contest/ToastifyContest";

export const Authorization = ({ children, accessBy }) => {
  const user = useSelector((state) => state.user.id);
  const dispatch = useDispatch();
  // const cookie = getCookies();
  const cookie = localStorage.getItem('userToken')
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const { show } = useContext(ToastifyContest)
  useEffect(() => {
    (function () {
      if (accessBy == "Authorized") {
        if (user) {
          // alert('HI')
          setLoading(false);
        } else if (cookie ) {
          api
            .get("/token_v")
            .then((response) => {
              if (response.data.status) {
                dispatch(userLogin(response.data.user));
                setLoading(false);
              }
            })
            .catch((error) => {
              console.log('Blocked');
              const expires = "expires=" + "Thu, 01 Jan 1970 00:00:01 GMT";
              // Thu, 01 Jan 1970 00:00:01 GMT
              document.cookie =
                "userToken=Bearer " + ";" + expires + "; path=/";
              dispatch(userLogout());
              show('you are blocked',401)
              navigate("/login");
            });
        } else {
          window.location.href = "/";
        }
      } else if (accessBy == "non-Authorized") {
        // if (!cookie["userToken"]) {
        //   return children;
        // }
        if (user) {
          alert("login");
          setLoading(false);
        } else if (cookie) {
          api.get("/token_v").then((response) => {
            if (response.data.user) {
              dispatch(userLogin(response.data.user));
              setLoading(false);
              // navigate('/')
            }
          });
          // window.location.href = '/'
        }
      }
    })();
  }, []);

  if (!loading && accessBy == "Authorized") {
    return children;
  } else if (!loading && accessBy == "non-Authorized") {
    console.log(!!loading);
    console.log(accessBy == "non-Authorized");

    navigate("/");
  } else if (loading && accessBy == "non-Authorized") {
    return children;
  }
  //   else {
  //     return navigate("/login")
  //     }
  //
};
