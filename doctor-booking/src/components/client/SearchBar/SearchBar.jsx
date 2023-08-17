import React, { useEffect } from "react";

function SearchBar({ search, value, specilizations, handleCheckBoxChange }) {
  return (
    <div className=" flex flex-col items-center h-full py-2 w-full">
      <div className="w-3/4 my-5">
        <input
          type="search"
          className=" w-full rounded-xl p-4 border-2 border-spacing-8"
          placeholder="Search For Doctors "
          value={value}
          onChange={(e) => search(e)}
        />
      </div>
      <div className="w-3/4 flex flex-col my-5 gap-4 border-2 p-4 rounded-xl ">
        <p className="font-bold">Speciality</p>
        <hr />
        {specilizations?.map((specilization, index) => {
          return (
            <div className="w-full " key={index}>
              <div className="flex gap-2 ">
                <div className="w-5 h-5 flex justify-center items-center  rounded-full border-2 border-[#189AB4]">
                <input
                  checked={specilization.checked}
                  type="checkbox"
                  value={specilization?._id}
                  name="specilization"
                  className="w-3 h-3 rounded-full appearance-none checked:bg-green-400 "
                  onChange={(e) => handleCheckBoxChange(e, index)}
                />
                </div>
                
                <label htmlFor="">{specilization?.name}</label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchBar;
