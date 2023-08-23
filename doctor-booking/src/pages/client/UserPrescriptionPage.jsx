import React, { useEffect, useState } from "react";
import Navbar from "../../components/client/navbar/Navbar";
import UserProfileSideBar from "../../components/client/UserProfileSideBar/UserProfileSideBar";
import api from "../../helper/axios/userAxios";
import UserPrescripton from "../../components/client/UserPrescription/UserPrescriptons";
import { useSelector } from "react-redux";

function UserPrescriptionPage() {
  const userId = useSelector((store) => store.user.id);
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState("");
  const [consultation, setConsultation] = useState([]);
  console.log(userId);

  useEffect(() => {
    if (userId) {
      api
        .get(`/prescription/${userId}`)
        .then((res) => {
          if (res.data.status) {
            console.log(res.data.user);
            setConsultation([...res.data.consulation]);
            console.log(res.data.consulation);
            //   setEdit(prev=>!prev)
          }
        })
        .catch((error) => {
          if (error.response) {
            show(error.response.data.message, error.response.status);
          } else if (error.request) {
            navigate("/500");
          } else {
            console.log(error);
          }
        });
    }
  }, [userId, edit]);
  return (
    <div>
      <div className="h-[10vh]">
        <Navbar />
      </div>

      <div className=" h-[100vh] grid grid-cols-[3fr_7fr] gap-3 ">
        <div className="w-full h-full ">
          <UserProfileSideBar user={user} image={image} setImage={setImage} />
        </div>
        <div className="w-full h-full my-auto ">
          <UserPrescripton consultaion={consultation} />
        </div>
      </div>
    </div>
  );
}

export default UserPrescriptionPage;
