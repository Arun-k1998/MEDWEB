import React, { useState } from "react";
import "./UserProfileDetails.css";

function UserProfileDetails({ user,edit,setEdit }) {
 

  return (
    <div className="w-[90%] h-[80%] my-10 mx-auto bg-slate-50 py-5 relative ">
      {!edit ? (
        <div className="absolute top-10 right-10">
          <button
            className="bg-[#5bbfe0] w-36 text-white p-2 rounded-lg Edit_button"
            onClick={() => setEdit((prev) => !prev)}
          >
            Edit
          </button>
        </div>
      ) : (
        <div className="absolute top-10 right-10">
          <button
            className="bg-lime-950 w-36 text-white p-2 rounded-lg save_changes"
            onClick={() => setEdit((prev) => !prev)}
          >
            Save Changes
          </button>
        </div>
      )}

      <div className=" w-full h-auto mt-10 grid grid-cols-3 gap-3 pt-10 px-6">
         <div className="w-full  h-full flex flex-col my-3">
            <label htmlFor="" className="my-3">FirstName</label>
            <input type="text" placeholder={user.firstName} className={`${edit?'':' disabled'} border-2 p-1`}  />
         </div>
         <div className="w-full  flex flex-col  my-3">
            <label htmlFor="" className="my-3" >Last Name</label>
            <input type="text" placeholder={user.lastName} className={`border-2 p-1`} />
         </div>
         <div className="w-full  flex flex-col  my-3">
            <label htmlFor="" className="my-3" >Email</label>
            <input type="text" placeholder={user.email} className={`border-2 p-1`} />
         </div>
         <div className="w-full flex flex-col  my-3">
            <label htmlFor="" className="my-3" >Phone Number</label>
            <input type="text" placeholder={user.phoneNumber} className="border-2 p-1" />
         </div>

      </div>
    </div>
  );
}

export default UserProfileDetails;
