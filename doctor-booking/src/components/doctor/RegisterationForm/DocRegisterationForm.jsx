import React, { useContext, useEffect, useState } from "react";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { doctorContext } from "../../../helper/contest/DoctorContext";

function DocRegisterationForm() {
  const [doctor, setDoctor] = useState({});
  const { id } = useContext(doctorContext);

  const [experience, setExperience] = useState([{}]);
  const [specialization, setSpecilaization] = useState([{}]);
  const [specializationField, setSpecializationFiled] = useState([{}]);
  const initialValues = {
    id:id,
    registerNumber: "",
    counsilName: "",
    yearOfRegisteration: "",
    specialization: "",
    Age: "",
    image:''
  };
  const [formValues, setFormValues] = useState(initialValues);

  const inputChange = (e) => {
    const { name, value } = e.target;

    setFormValues({ ...formValues, [name]: value });
    console.log(formValues);
  };

  const addMore = () => {
    setExperience([...experience, {}]);
  };

  const imageChange = (e)=>{
    const {name} = e.target
    const image = e.target.files[0]
    setFormValues({...formValues,[name]:image})
    console.log(formValues);
  }

  const onChangeExperience = (e, index) => {
    const { name, value } = e.target;
    const spec = [...experience];
    spec[index][name] = value;
    setExperience([...spec]);
    console.log(setExperience);
  };

  const handleSubmit = () => {
    
    const form = new FormData()
    form.append('formValues',JSON.stringify(formValues))
    form.append('image',formValues.image)
    form.append('experience',JSON.stringify(experience))
    doctorApi
      .post("/register",form,{
        headers: {
          "content-type": "multipart/form-data",
        }
      })
      .then((response) => {
        if (response.data.status) {
          alert(response.data.message);
        }
      });
  };

  useEffect(() => {
    doctorApi.get(`/register/?id=${id}`).then((response) => {
      if (response.data.status) {
        setDoctor(response.data.doctor);
        setSpecilaization([...response.data.specialization]);
        console.log(specializationField);
      }
    });
  }, []);

  return (
    <div className="p-10 bg-slate-200">
      <div className="mx-auto bg-white rounded-lg p-5 ">
        <div className="grid grid-cols-[2fr_8fr]">
          <div className="rounded-full overflow-hidden relative h-60 w-auto flex justify-center">
            <img
              src={formValues.image ? URL.createObjectURL(formValues.image) : ""}
              alt=""
              className="h-full  rounded-full w-full"
            />
            <div className="absolute bottom-0 left-10 rounded-full overflow-hidden">
            <input className="bg-amber-200 " name="image"  onChange={imageChange} type="file"/>

            </div>
          </div>
          <div className="flex flex-col  ml-40 w-1/2">
            <div className="flex grid grid-cols-3">
              <p>Full Name</p>
              <span>:</span>
              <p className="mb-4">
                {" "}
                {doctor?.firstName + " " + doctor?.lastName}
              </p>
            </div>
            <div className="flex grid grid-cols-3">
              <p>Phone Number</p>
              <span>:</span>
              <p className="mb-4"> {doctor?.phoneNumber}</p>
            </div>
            <div className="flex grid grid-cols-3">
              <p>Email </p>
              <span>:</span>
              <p className="mb-4"> {doctor?.email}</p>
            </div>
          </div>
        </div>

        <hr className="my-4" />
        <div>
          <div className="grid grid-cols-2">
            <div className="w-full">
              <div>
                <h2 className=" mb-4 underline underline-offset-8 " >Registeraton Details</h2>
                
                <div className="grid grid-cols-3">
                  <label htmlFor="">Register Number <span className="text-red-600">*</span> </label>
                  <input
                    type="text"
                    onChange={(e) => inputChange(e)}
                    value={formValues.registerNumber}
                    name="registerNumber"
                    className="border-2 p-1 mb-2"
                  />
                </div>
              
              <div className="grid grid-cols-3">
                <label htmlFor="">Counsil Name <span className="text-red-600">*</span></label>
                <input
                  type="text"
                  onChange={(e) => inputChange(e)}
                  value={formValues.counsilName}
                  name="counsilName"
                  className="border-2 p-1 mb-2"
                />
              </div>
              <div className="grid grid-cols-3">
                <label htmlFor="">Year of Registeration <span className="text-red-600">*</span></label>
                <input
                  type="date"
                  onChange={(e) => inputChange(e)}
                  value={formValues.yearOfRegisteration}
                  name="yearOfRegisteration"
                  className="border-2 p-1 mb-2 "
                />
              </div>
            </div>
            <hr className="my-4 " />

            <div className="grid grid-cols-3" >
              <label htmlFor="">Specialization <span className="text-red-600">*</span></label>
              <select
                name="specialization"
                onChange={(e) => inputChange(e)}
                id=""
                className="border-2 p-1 mb-2 "
              >
                <option value="">Specialization</option>
                {specialization.map((Specialization) => {
                  return (
                    <option value={Specialization._id}>
                      {Specialization.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Age</label>
              <input
                type="number"
                onChange={(e) => inputChange(e)}
                value={formValues.Age}
                name="Age"
                className="border-2 p-1 mb-2 "
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="">Langauges Known</label>
              <input type="text" onChange={(e) => inputChange(e)} name="languages" className="border-2 p-1 mb-2" />
            </div>
            <div>
              <div>
                <h2 className="mb-4 underline underline-offset-8" >Experiences</h2>
              </div>
              <div>


              </div>
              {experience.map((ele, index) => {
                return (
                  <div key={index} className="flex " >
                    <div className="">
                      <label htmlFor="">Hostpital <span className="text-red-600">*</span></label>
                      <input
                        type="text"
                        name="hospital"
                        onChange={(e) => onChangeExperience(e, index)}
                        className="border-2 p-1 mb-2 "
                      />
                    </div>

                    <div className="">
                      <label htmlFor="">From <span className="text-red-600">*</span></label>
                      <input
                        type="date"
                        name="from"
                        onChange={(e) => onChangeExperience(e, index)}
                        className="border-2 p-1 mb-2"

                      />
                    </div>
                    <div className="" >
                      <label htmlFor="">to <span className="text-red-600">*</span></label>
                      <input
                        type="date"
                        name="to"
                        onChange={(e) => onChangeExperience(e, index)}
                        className="border-2 p-1 mb-2"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          <button onClick={addMore} className="bg-lime-500 p-2" >Add More</button>

          </div>
          
        </div>
        <div className="w-full flex justify-center ">
        <button onClick={handleSubmit} className="bg-red-500 p-2">
            {" "}
            Submit{" "}
          </button>
        </div>
        
        </div>
      </div>
    </div>
  );
}

export default DocRegisterationForm;
