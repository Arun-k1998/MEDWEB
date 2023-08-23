import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doctorApi } from "../../helper/axios/doctorAxios";
import Navbar from "../../components/doctor/Navbar/Navbar";
import Sidebar from "../../components/doctor/Sidebar/Sidebar";
import DoctorProfileComponent from "../../components/doctor/DoctorProfile/DoctorProfile";

function DoctorProfile() {
  const { id } = useParams();
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  };
  const [doctor, setDoctor] = useState({});
  const [doctorNew, setDoctorNew] = useState({});
  const [success, setSuccess] = useState(false);
  const [image, setImage] = useState("");

  const onImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorNew((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = () => {
    const form = new FormData();

    form.append("doctorData", JSON.stringify(doctorNew));
    form.append("image", image);
    form.append("id", doctor._id);
    doctorApi
      .post("/profile", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.status) {
          alert("success");
          setDoctor({ ...res.data.user });
          setSuccess((prev) => !prev);
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
    if (id) {
      doctorApi
        .get(`/profile/${id}`)
        .then((response) => {
          if (response.data.status) {
            setDoctor({ ...response.data.doctor });
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
  }, [id, success]);
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full h-full">
        <Sidebar />
        <div className="w-full h-full">
          <DoctorProfileComponent
            doctorData={doctor}
            onImageChange={onImageChange}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            doctorNew={doctorNew}
          />
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;
