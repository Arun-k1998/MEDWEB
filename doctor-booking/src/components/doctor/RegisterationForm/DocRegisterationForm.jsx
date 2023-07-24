import React, { useContext, useEffect, useState } from "react";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import { doctorContext } from "../../../helper/contest/DoctorContext";
import { useSelector } from "react-redux";
import './button.css'
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";
import { useNavigate } from "react-router-dom";
function DocRegisterationForm() {
  const [doctor, setDoctor] = useState({});
  const { id } = useSelector((store) => store.doctor);
  const {show} = useContext(ToastifyContest)
  const navigate = useNavigate()
  const [experience, setExperience] = useState([{}]);
  const [specialization, setSpecilaization] = useState([{}]);
  const [specializationField, setSpecializationFiled] = useState([{}]);
  const initialValues = {
    id: id,
    registerNumber: "",
    counsilName: "",
    yearOfRegisteration: "",
    specialization: "",
    Age: "",
    image: "",
    consultationFee: "",
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

  const imageChange = (e) => {
    const { name } = e.target;
    const image = e.target.files[0];
    setFormValues({ ...formValues, [name]: image });
    console.log(formValues);
  };

  const onChangeExperience = (e, index) => {
    const { name, value } = e.target;
    const spec = [...experience];
    spec[index][name] = value;
    setExperience([...spec]);
    console.log(setExperience);
  };

  const deletExperience = (index)=>{
    setExperience(prev=>{
      return prev.filter((ele,indexx)=> index!= indexx )
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("formValues", JSON.stringify(formValues));
    form.append("image", formValues.image);
    form.append("experience", JSON.stringify(experience));
    doctorApi
      .post("/register", form, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.status) {
          show(response.data.message)
          navigate('/doctor/dashboard')
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
        <form action="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-[2fr_8fr]">
            <div className="rounded-full overflow-hidden relative h-60 w-auto flex justify-center">
              <img
                src={
                  formValues.image ? URL.createObjectURL(formValues.image) : ""
                }
                alt=""
                className="h-full  rounded-full w-full"
              />
              <div className="absolute bottom-0 left-10 rounded-full overflow-hidden">
                <input
                  className="bg-amber-200 "
                  name="image"
                  onChange={imageChange}
                  type="file"
                />
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
                  <h2 className=" mb-4 underline underline-offset-8 ">
                    Registeraton Details
                  </h2>

                  <div className="grid grid-cols-3">
                    <label htmlFor="">
                      Register Number <span className="text-red-600">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      onChange={(e) => inputChange(e)}
                      value={formValues.registerNumber}
                      name="registerNumber"
                      className="border-2 p-1 mb-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3">
                    <label htmlFor="">
                      Counsil Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      onChange={(e) => inputChange(e)}
                      value={formValues?.counsilName}
                      name="counsilName"
                      className="border-2 p-1 mb-2"
                      required
                      // {...register("counsilName", { required: {value:true ,message:"Counsil name is required" }})}
                    />
                  </div>
                  <div className="grid grid-cols-3">
                    <label htmlFor="">
                      Year of Registeration{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        type="date"
                        onChange={(e) => inputChange(e)}
                        value={formValues.yearOfRegisteration}
                        name="yearOfRegisteration"
                        className="border-2 p-1 mb-2 w-full"
                        required
                        // {...register("yearOfRegisteration", { required: true })}
                      />
                    </div>
                  </div>
                </div>
                <hr className="my-4 " />

                <div className="grid grid-cols-3">
                  <label htmlFor="">
                    Specialization <span className="text-red-600">*</span>
                  </label>
                  <select
                    name="specialization"
                    onChange={(e) => inputChange(e)}
                    id=""
                    className="border-2 p-1 mb-2 "
                    required
                    // {...register("specialization", { required: true })}
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
                  <label htmlFor="">Langauge Known</label>
                  <input
                    type="text"
                    onChange={(e) => inputChange(e)}
                    name="languages"
                    className="border-2 p-1 mb-2"
                  />
                </div>
                <div className="grid grid-cols-3">
                  <label htmlFor="">
                    Consultaion Fee <span className="text-red-600">*</span>
                  </label>
                  <div className="w-full ">
                    <input
                      type="number"
                      onChange={(e) => inputChange(e)}
                      value={formValues.consultationFee}
                      name="consultationFee"
                      className="border-2 p-1 mb-2 w-full"
                      required
                      // {...register("yearOfRegisteration", { required: true })}
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <h2 className="mb-4 underline underline-offset-8">
                      Experiences
                    </h2>
                  </div>

                  {experience.map((ele, index) => {
                    return (
                      <div key={index} className="flex ">
                        <div className="">
                          <label htmlFor="">
                            Hostpital 
                            {/* <span className="text-red-600">*</span> */}
                          </label>
                          <input
                            type="text"
                            name="hospital"
                            onChange={(e) => onChangeExperience(e, index)}
                            className="border-2 p-1 mb-2 "
                          />
                        </div>

                        <div className="">
                          <label htmlFor="">
                            From
                             {/* <span className="text-red-600">*</span> */}
                          </label>
                          <input
                            type="date"
                            name="from"
                            onChange={(e) => onChangeExperience(e, index)}
                            className="border-2 p-1 mb-2"
                          />
                        </div>
                        <div className="">
                          <label htmlFor="">
                            to 
                            {/* <span className="text-red-600">*</span> */}
                          </label>
                          <input
                            type="date"
                            name="to"
                            onChange={(e) => onChangeExperience(e, index)}
                            className="border-2 p-1 mb-2"
                          />
                        </div>
                        <div className="flex flex-col justify-center mt-2 ml-3">
                          <div className="btn" onClick={()=>deletExperience(index)} >
                            <svg
                              viewBox="0 0 15 17.5"
                              height="17.5"
                              width="15"
                              xmlns="http://www.w3.org/2000/svg"
                              class="icon"
                            >
                              <path
                                transform="translate(-2.5 -1.25)"
                                d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                                id="Fill"
                              ></path>
                            </svg>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={addMore}
                  className="bg-lime-500 p-2 rounded-xl text-white hover:bg-lime-800 "
                >
                  Add More
                </button>
              </div>
            </div>
            <div className="w-full flex justify-center ">
              <button
                type="submit"
                // onClick={handleSubmit}
                className="bg-red-500 p-2 w-1/4 text-white rounded-xl hover:"
              >
                {" "}
                Submit{" "}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DocRegisterationForm;
