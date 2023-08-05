import React, { useRef, useState } from "react";
function DoctorProfile({
  doctorData,
  onImageChange,
  handleSubmit,
  handleChange,
  doctorNew,
}) {
  const { VITE_SERVER_URL } = import.meta.env;
  const fileInputRef = useRef(null);
  const [edit, setEdit] = useState(false);

  const handlePlusButtonClick = () => {
    // When the plus button is clicked, trigger the click event of the file input element
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="h-[40vh]  w-full overflow-hidden my-2 py-5">
        <div className="relative  ">
         { !edit && <button
            className="absolute top-0 right-5"
            onClick={() => setEdit((pre) => !pre)}
          >
            Edit
          </button>}
          <div className="mx-auto w-48 h-48 shadow-2xl shadow-black bg-slate-500 rounded-full">
            <img
              src={`${VITE_SERVER_URL}/images/${doctorData.image}`}
              alt=""
              className="mx-auto w-48 h-48 object-cover rounded-full border border-spacing-2.5 border-x-red-600"
            />
          </div>

          <button
            className={
              !edit
                ? "hidden"
                : "bg-black  rounded-full w-8 h-8 flex justify-center items-center text-white absolute bottom-0 left-1/2 transform -translate-x-1/2 cursor-pointer"
            }
            onClick={handlePlusButtonClick}
          >
            +
          </button>
          <input
            type="file"
            name="image"
            onChange={onImageChange}
            ref={fileInputRef}
            className="hidden w-8 h-8 absolute cursor-pointer mt-2"
          />
        </div>
      </div>
      {/* Input element is now placed below the plus button */}

      <div className=" grid grid-cols-3 gap-3 my-2 px-4">
        <div className="flex items-center justify-evenly">
          <div className="w-1/2 flex h-full text-start p-2 items-center">
            <label htmlFor="" className="w-full">
              First Name :
            </label>
          </div>
          <input
            disabled={!edit}
            type="text"
            name="firstName"
            placeholder={doctorData.firstName}
            value={doctorNew.firstName}
            onChange={handleChange}
            className="w-1/2 bg-gray-300 p-2"
          />
        </div>
        <div className="flex justify-around items-center">
          <div className="w-1/2 flex h-full p-2 text-start items-center">
            <label htmlFor="" className="w-full">
              Last Name :
            </label>
          </div>
          <input
            disabled={!edit}
            type="text"
            name="lastName"
            placeholder={doctorData.lastName}
            value={doctorNew.lastName}
            onChange={handleChange}
            className="w-1/2 bg-gray-300 p-2"
          />
        </div>
        <div className="flex justify-around items-center">
          <div className="w-1/2 flex p-2 h-full text-start items-center">
            <label htmlFor="" className="w-full">
              Email :
            </label>
          </div>
          <input
            disabled={!edit}
            type="text"
            name="email"
            placeholder={doctorData.email}
            value={doctorNew.email}
            onChange={handleChange}
            className="w-1/2 bg-gray-300 p-2"
          />
        </div>
        <div className="flex justify-around items-center">
          <div className="w-1/2 flex h-full text-start p-2 items-center">
            <label htmlFor="" className="full">
              Phone Number :
            </label>
          </div>
          <input
            disabled={!edit}
            type="number"
            name="phoneNumber"
            placeholder={doctorData.phoneNumber}
            value={doctorNew.phoneNumber}
            onChange={handleChange}
            className="w-1/2 bg-gray-300 p-2"
          />
        </div>
        <div className="flex justify-around items-center">
          <div className="w-1/2 flex h-full text-start p-2 items-center">
            <label htmlFor="" className="full">
              Consultaion Fee :
            </label>
          </div>
          <input
            disabled={!edit}
            type="number"
            name="phoneNumber"
            placeholder={doctorData.feePerConsultation}
            value={doctorNew.feePerConsultation}
            onChange={handleChange}
            className="w-1/2 bg-gray-300 p-2"
          />
        </div>
      </div>
      <div className="w-full flex justify-center mt-10">
      { edit && <button onClick={handleSubmit} className="p-2 w-1/4 bg-lime-700">update</button>}

      </div>
      <div className="mt-6 px-4 ">
        <hr />
      </div>

      <div className="grid grid-cols-3 gap-3 my-2 px-4">
        <div className="flex justify-around items-center">
          <div className="w-1/2 flex h-full text-start p-2 items-center">
            <label htmlFor="" className="full">
              Registeration Number :
            </label>
          </div>
          <input
            disabled
            type="text"
            name="registerNumber"
            placeholder={doctorData.registerNumber}
            value={doctorData.registerNumber}
            onChange={handleChange}
            className="w-1/2 bg-gray-300 p-2"
          />
        </div>

        <div className="flex justify-around items-center">
          <div className="w-1/2 flex h-full text-start p-2 items-center">
            <label htmlFor="" className="full">
              Year of Registeration :
            </label>
          </div>
          <input
            disabled
            type="number"
            name="yearOfRegisteration"
            placeholder={doctorData.yearOfRegisteration}
            value={doctorData.yearOfRegisteration}
            onChange={handleChange}
            className="w-1/2 bg-gray-300 p-2"
          />
        </div>
      </div>
      

    </>
  );
}

export default DoctorProfile;
