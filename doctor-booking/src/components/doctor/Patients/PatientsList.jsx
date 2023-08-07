import React, { useState } from "react";
import "./PatientList.css";
import icon from "../.../../../../assets/logo/medweblogo.png";
import moment from "moment";

function PatientsList({ patients }) {
  const { VITE_SERVER_URL } = import.meta.env;
  console.log("----patientListing----", patients);
  const [prescription, setPrescription] = useState(false);
  const [index, setIndex] = useState(null);

  const formateDate = (date) => {
    let result = moment(date).format("LL");
    return result;
  };
  return (
    <div className="w-full h-full p-5 relative">
      <div className=" h-full grid grid-cols-3 gap-5 ">
        {patients.map((patient, index) => {
          return (
            <div className="w-4/5 shadow-2xl h-96 flex flex-col mx-auto  p-5 ">
              <div className="w-full flex flex-col items-center ">
                <div className="w-32 h-32 overflow-hidden rounded-full my-2">
                  <img
                    src={
                      patient?.userId?.image
                        ? `${VITE_SERVER_URL}/images/${patient?.userId?.image}`
                        : "https://www.shutterstock.com/image-vector/male-silhouette-avatar-profile-picture-600w-199246382.jpg"
                    }
                    alt=""
                  />
                </div>
                <div className="my-2">
                  <p>{patient?.userId?.firstName}</p>
                </div>
              </div>
              <div className="my-2">
                <hr />
              </div>
              <div className="w-full flex-col items-stretch">
                <div className="w-full flex justify-between my-2">
                  <p>Phone Number</p>
                  <p>{patient?.userId?.phoneNumber}</p>
                </div>
                <div className="w-full flex justify-between my-2">
                  <p>Email</p>
                  <p>{patient?.userId?.email}</p>
                </div>
                <div className="w-full flex justify-center mt-8">
                  <button
                    className="p-2  rounded-md prescription"
                    onClick={() => {
                      setIndex(index);
                      setPrescription((prev) => !prev);
                    }}
                  >
                    Prescription
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {prescription && (
        <div className="bg-white shadow-2xl rounded-3xl absolute top-10  left-1/4 flex w-1/2 h-3/4 p-5">
          <div className="">
            <p
              onClick={() => setPrescription((prev) => !prev)}
              className="absolute top-3  right-3 rotate-45 text-3xl cursor-pointer hover:shadow-lg bg-transparent rounded-full w-4 h-4 "
            >
              {" "}
              +
            </p>
          </div>
          <div className="w-full h-full mt-5">
            <div className="w-full flex flex-col items-center justify-center h-36 p-2   overflow-hidden">
              <div className="w-36  h-auto overflow-hidden">
                <img src={icon} alt="" className="w-36 h-28" />
              </div>
              <div className="w-full mt-2">
                <hr className=" " />
              </div>
            </div>
            <div className="w-full p-2  flex  h-36  ">
              <div className="w-1/3 flex flex-col gap-4  ">
                <div className="w-full grid grid-cols-3">
                  <p>Doctor</p>
                  <span>:</span>
                  <p>{patients[index]?.doctorId?.firstName}</p>
                </div>
                <div className="w-full grid grid-cols-3">
                  <p>Patient</p>
                  <span>:</span>
                  <p>{patients[index]?.userId?.firstName}</p>
                </div>
                <div className="w-full grid grid-cols-3">
                  <p>Gender</p>
                  <span>:</span>
                  <p>{patients[index]?.userId?.gender ?? "Male"}</p>
                </div>
              </div>
              <div className="w-1/3 flex gap-2 items-center justify-center">
                <p>Token</p>
                <span>:</span>
                <p>{patients[index]?.tokenNo}</p>
              </div>
              <div className="w-1/3 flex justify-between items-center">
                <p>Date</p>
                <span>:</span>
                <p>{formateDate(patients[index].date)}</p>
              </div>
            </div>
            <div className="my-2">
              <hr />
            </div>
            <div className="w-full h-atuo ">
              <table class="w-full max-h-14 text-sm text-left text-gray-500 dark:text-gray-400 shadow-xl rounded-lg overflow-hidden">
               
                <thead class="text-xs py-2 text-gray-700 uppercase bg-[#05445E] dark:text-gray-400">
                  <tr>
                    <th class="px-4 py-2">Medicine</th>
                    <th class="px-4 py-2">Quantity</th>
                    <th class="px-4 py-2">totalDays</th>
                    <th class="px-4 py-2">Order</th>
                    <th class="px-4 py-2">action</th>
                  </tr>
                </thead>
                <tbody>
                  {patients[index].prescription.map((medicine) => {
                    return (
                      <tr className="bg-lime-50">
                        <td class="px-4 py-2">{medicine?.medicine}</td>
                        <td class="px-4 py-2">{medicine?.quantity}</td>
                        <td class="px-4 py-2">{medicine.totalDays}</td>
                        <td class="px-4 py-2">
                          {medicine.morning ? 1 : 0}-
                          {medicine.afterNoon ? 1 : 0}-{medicine.night ? 1 : 0}
                        </td>
                        <td class="px-4 py-2">
                          <p>{medicine.af ? "AF" : ""}</p>
                          <p>{medicine.bf ? "BF" : ""}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientsList;
