import React from "react";

function DoctorListingCard({ doctors }) {
  const { VITE_SERVER_URL } = import.meta.env;
  return (
    <div className="mt-10">
      {doctors.map((doctor) => {
        return (
          <div className="w-5/6 h-60 overflow-hidden mx-10 p-5 bg-slate-100 flex ">
            <div className="flex justify-start w-full">
              <div className="w-44 h-full rounded-full overflow-hidden  ">
                <img
                  src={`${VITE_SERVER_URL}/images/${doctor.image}`}
                  className="object-cover h-full w-full "
                />
              </div>
              <div className="ml-4 ">
                <p>{`${doctor.firstName} ${doctor.lastName}`}</p>
                <p>{doctor.specialization.name}</p>
                <p>Experience : 6years</p>
                <strong>Consultation Fee: 100</strong>
              </div>
              </div>

              <div className=" flex flex-col justify-center">
                <button className="bg-white p-2 rounded-xl w-32" >Book Slot</button>
                <button className="bg-white p-2 rounded-xl w-32 " >View Profile</button>
              </div>
           
          </div>
        );
      })}
    </div>
  );
}

export default DoctorListingCard;
