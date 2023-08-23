import React, { useContext, useEffect, useState } from "react";
import AdminNavbar from "../../components/admin/navbar/AdminNavbar";
import Sidebar from "../../components/admin/sideBar/Sidebar";
import UserManagement from "../../components/admin/UserManagement/UserManagement";
import { ToastifyContest } from "../../helper/contest/ToastifyContest";
import { adminApi } from "../../helper/axios/adminAxios";

function DoctorMangementPage() {
  const [userBlock, setUserBlock] = useState(false);
  const { show } = useContext(ToastifyContest);
  const [doctorList, setDoctorList] = useState([{}]);
  const handleClick = (action, docotrId) => {
    adminApi
      .post(`/doctor_b/${action}/${docotrId}`)
      .then((res) => {
        if (res.data.status) {
          setUserBlock((prev) => !prev);
          show(res.data.message);
        } else {
          show(res.data.message, res.data.status);
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
  };

  useEffect(() => {
    adminApi.get("/doctor_list").then((res) => {
      if (res.data.status) {
        setDoctorList([...res.data.doctorList]);
      }
    });
  }, [userBlock]);
  return (
    <div>
      <AdminNavbar />
      <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full">
        <Sidebar />
        <div className="flex w-full justify-center items-center ">
          <UserManagement userList={doctorList} handleClick={handleClick} />
        </div>
      </div>
    </div>
  );
}

export default DoctorMangementPage;
