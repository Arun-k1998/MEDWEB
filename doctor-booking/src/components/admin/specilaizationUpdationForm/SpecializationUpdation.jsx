import React, { useContext, useEffect, useState } from "react";
import { adminApi } from "../../../helper/axios/adminAxios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";

function SpecializationUpdation() {
  const { VITE_SERVER_URL } = import.meta.env;
  const { name } = useParams();
  const navigate = useNavigate()
  const {show} = useContext(ToastifyContest)
  const initialValues = {
    id: name,
    name: "",
    description: "",
    image: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [serverImage, setServerImage] = useState("");

  // const [name,setName] = useState('')
  // const [description,setDescription] = useState('')
  // const [image,setImage] = useState('')
  const [preview, setPreview] = useState(false);

  const imageSetting = (e) => {
    const { name } = e.target;

    setFormValues((prev) => {
      return { ...prev, [name]: e.target.files[0] };
    });
    setPreview(true);
  };

  const handleSubmit = () => {
    const form = new FormData();
    form.append("formValues", JSON.stringify(formValues));
    console.log(formValues.image);
    console.log(serverImage);
    form.append("image", formValues.image);
    adminApi
      .patch("/specialization_u", form, {
        headers: {
          "content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.status) {
            show(response.data.message)
            navigate('/admin/specialization')
        }
      });
  };

  const onChangee = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const notification = (message) => {
    toast.success(`🦄 ${message} `, {
        position: "top-left",
        autoClose: 3001,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
  };

  useEffect(() => {
    adminApi.get(`/specialization_u?name=${name}`).then((response) => {
      if (response.data.status) {
        setFormValues({
          ...response.data.document,
          ["id"]: response.data.document.name,
        });
        setServerImage(response.data.document.image);
      }
    });
  }, []);

  return (
    <div className="w-3/4 bg-white p-11 rounded-3xl h-3/4 shadow-lg grid grid-cols-2 md:grid-cols-3 gap-4 ">
      <div className="flex flex-col h-full">
        <p>{formValues.id}</p>
        <input
          type="text"
          placeholder="Name"
          className="p-4 mt-4 shadow-lg rounded-lg "
          onChange={onChangee}
          value={formValues?.name}
          name="name"
        />
        <input
          type="file"
          name="image"
          className="p-2 mt-4 shadow-lg rounded-lg"
          onChange={imageSetting}
        />
        <textarea
          type="text"
          placeholder="Description"
          className="p-2 mt-4 shadow-lg h-1/3 rounded-lg"
          onChange={onChangee}
          value={formValues?.description}
          name="description"
        />
        <button
          className="p-2 mt-4 bg-sky-400 w-2/4 rounded-3xl mx-auto"
          onClick={handleSubmit}
        >
          Upload
        </button>
      </div>
      <div className="flex flex-col md:col-span-2 ">
        <div className="flex flex-col text-center justify-center border-2 mx-20 h-72 px-10 py-6 ">
          {preview && (
            <>
              <p
                onClick={() => {
                  setPreview(false);
                  setFormValues((pre) => {
                    return {
                      ...pre,
                      ["image"]: "",
                    };
                  });
                }}
              >
                close
              </p>
              <img
                className="w-full h-full    rounded-lg  "
                src={
                  formValues.image ? URL.createObjectURL(formValues.image) : ""
                }
                alt=""
              />
            </>
          )}
          {!preview && (
            <>
              <p>preview</p>
              <img
                className="w-full h-full    rounded-lg  "
                src={`${VITE_SERVER_URL}/images/${serverImage}`}
                alt=""
              />
            </>
          )}
        </div>
      </div>
      {/* <ToastContainer
        position="top-left"
        autoClose={3001}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      /> */}
    </div>
  );
}

export default SpecializationUpdation;
