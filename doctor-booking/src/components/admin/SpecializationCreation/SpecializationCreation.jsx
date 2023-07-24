import React, { useContext, useState } from 'react'
import { adminApi } from '../../../helper/axios/adminAxios';
import bannerPreview from '../../../assets/bannerPreview.jpg'
import { ToastifyContest } from '../../../helper/contest/ToastifyContest';
function SpecializationCreation() {
    const [name, setname] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [banner,setBanner] = React.useState(false)
    const {show} = useContext(ToastifyContest)
    const bannerSetting = (e)=>{
      setImage(e.target.files[0])
      setBanner(true)
    }
  
    const handleSubmit = () => {
      const form = new FormData();
      form.append("image", image);
      form.append("name", name);
      form.append("description", description);
  
      adminApi
        .post("/c_specialization", form, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.data.status) {
            alert(response.data.message)
          }
          else if(!response.data.status){
            show(response.data.message)
          }
        });
    };

    
    return (
      <div className="w-3/4 bg-white p-11 rounded-3xl h-3/4 shadow-lg grid grid-cols-2 md:grid-cols-3 gap-4 ">
        <div className="flex flex-col h-full">
          <input
            type="text"
            placeholder="name"
            className="p-4 mt-4 shadow-lg rounded-lg "
            onChange={(e) => setname(e.target.value)}
            value={name}
            required
          />
          <input
            type="file"
            name="image"
            className="p-2 mt-4 shadow-lg rounded-lg"
            onChange={bannerSetting}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="p-2 mt-4 shadow-lg h-1/3 rounded-lg"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
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
          {banner && <img
            className="w-full h-full    rounded-lg  "
            src={image ? URL.createObjectURL(image) : ""}
            alt=""
          />}
        {!banner &&
        (<>
          <p>preview</p>
        <img
            className="w-full h-full    rounded-lg  "
            src={bannerPreview}
            alt=""
          /></>)}
          </div>
         
        </div>
      </div>
    );
}

export default SpecializationCreation
