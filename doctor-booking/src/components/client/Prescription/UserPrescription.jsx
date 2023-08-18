import React from 'react'
import moment from 'moment';
import icon from "/images/medweblogo.png";
function UserPresCription({prescription,setPrescriptionState}) {
    
  const formateDate = (date) => {
    let result = moment(date).format("LL");
    return result;
  };
  console.log(prescription);
  return (
    <div className="bg-white shadow-2xl rounded-3xl   left-1/4 flex w-1/2 h-3/4 p-5 relative ">
          <div className="">
            <p
              onClick={() => setPrescriptionState((prev) => !prev)}
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
                  <p>{prescription?.doctorId?.firstName}</p>
                </div>
                <div className="w-full grid grid-cols-3">
                  <p>Patient</p>
                  <span>:</span>
                  <p>{prescription?.userId?.firstName}</p>
                </div>
                <div className="w-full grid grid-cols-3">
                  <p>Gender</p>
                  <span>:</span>
                  <p>{prescription?.userId?.gender ?? "Male"}</p>
                </div>
              </div>
              <div className="w-1/3 flex gap-2 items-center justify-center">
                <p>Token</p>
                <span>:</span>
                <p>{prescription?.tokenNo}</p>
              </div>
              <div className="w-1/3 flex justify-between items-center">
                <p>Date</p>
                <span>:</span>
                <p>{formateDate(prescription.date)}</p>
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
                  {prescription.prescription.map((medicine) => {
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
  )
}

export default UserPresCription
