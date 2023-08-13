import React from "react";
import moment from "moment";

function PaymentHistory({bookings}) {
    const formateDate = (date) => {
        let result = moment(date).format("LL");
        return result;
      };
  return (
  
      <div className="w-[85%] h-full flex justify-center mt-10 mx-auto">
        <table className="w-full max-h-14 text-sm text-left text-gray-500 dark:text-gray-400 shadow-xl ">
          <thead className="text-xs text-gray-700 uppercase bg-[#05445E] dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                SI No
              </th>
              <th scope="col" className="px-6 py-3">
                Patient Name
              </th>
              <th scope="col" className="px-6 py-3">
                Patient email
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Consultaton Fee
              </th>

              <th scope="col" className="px-6 py-3">
               Amount Get
              </th>
              <th scope="col" className="px-6 py-3">
               Admin
              </th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => {
              return (
                <>
                  <tr
                    className="bg-white border-b  dark:border-gray-700 "
                    key={index}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{`${booking?.userId?.firstName} ${booking?.userId?.lastName}`}</td>
                    <td className="px-6 py-4">{booking?.userId?.email}</td>
                    <td className="px-6 py-4">{formateDate(booking?.date)}</td>
                    <td className="px-6 py-4 cursor-pointer underline underline-offset-2">{booking?.doctorFee}</td>
                    <td className="px-6 py-4">{booking?.doctorPayment ??'-'}</td>
                    <td className="px-6 py-4">{booking?.adminPayment ?? '-'}</td>
                   
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
   
  );
}

export default PaymentHistory;
