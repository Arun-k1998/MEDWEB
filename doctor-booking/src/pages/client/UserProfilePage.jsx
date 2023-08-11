import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../helper/axios/userAxios";
import { useSelector } from "react-redux";
import Navbar from "../../components/client/navbar/Navbar";
import UserProfileSideBar from "../../components/client/UserProfileSideBar/UserProfileSideBar";
import UserProfileDetails from "../../components/client/UserDetails/UserProfileDetails";

function UserProfilePage() {
  const userId = useSelector((store) => store.user.id);
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [image,setImage] = useState('')
  
  console.log(userId);

  const handleSave = ()=>{
    const form = new FormData()
    form.append('user',JSON.stringify(user))
    form.append('userId',userId)
    if(image){
      console.log(';dfdfd');
      form.append('image',image)
    }
   console.log(form.get('image'));
    api.post(`/profile/${userId}`,form,{
      headers: {
        "content-type": "multipart/form-data",
      },
    }).then((res)=>{
      if(res.data.status){
        setEdit(prev=>!prev)
      }
    })
  }

  useEffect(() => {
    if (userId) {
      
      api.get(`/profile/${userId}`).then((res) => {
        if (res.data.status) {
          console.log(res.data.user);
          setUser({ ...res.data.user });
        }
      });
    }
  }, [userId,edit]);
  return (
    <div>
      <div className="h-[10vh]">
        <Navbar />
      </div>

      <div className=" h-[100vh] grid grid-cols-[3fr_7fr] gap-3 ">
        <div className="w-full h-full ">
          <UserProfileSideBar edit={edit} user={user} setImage={setImage} />
        </div>
        <div className="w-full h-full my-auto ">
          <UserProfileDetails user={user} edit={edit} setEdit={setEdit} setUser={setUser} handleSave={handleSave} />
        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;
