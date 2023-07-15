import { createContext, useEffect,useState } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode"


const userContest = createContext(null)
export function UserContest({children}) {
    const [data,setdata] = useState()
    const [user,setUser]= useState({})
    // useEffect(()=>{
    //     const token = Cookies.get('admin')
    //     const data = jwt_decode(token)
    //     console.log(data);
    //     setdata(data.id)

    // },[])
  return (
    <div>
      <userContest.Provider value={{data:data}}>
       { children }
      </userContest.Provider>
    </div>
  )
}

export default userContest
