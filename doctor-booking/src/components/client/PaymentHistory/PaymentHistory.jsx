import React from 'react'
import moment from 'moment';

function PaymentHistory({paymentHistory}) {

    const formateDate = (date) => {
        let result = moment(date).format("LL");
        return result;
      };
  return (
    <div className="w-[85%] h-full flex flex-col items-center mt-10 mx-auto">
      <div>
        <p className='text-lg my-5 underline underline-offset-8'>Payment History</p>
      </div>
        <table className="w-full max-h-14 text-sm text-left text-gray-500 dark:text-gray-400 shadow-xl ">
          <thead className="text-xs text-gray-700 uppercase bg-[#05445E] dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                SI No
              </th>
              <th scope="col" className="px-6 py-3">
                Doctor Name
              </th>
              <th scope="col" className="px-6 py-3">
                status
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Paid
              </th>
              <th scope="col" className="px-6 py-3">
                Refund
              </th>

            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((booking, index) => {
              return (
                <>
                  <tr
                    className="bg-white border-b  dark:border-gray-700 "
                    key={index}
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{`${booking?.doctorId?.firstName} ${booking?.doctorId?.lastName}`}</td>
                    <td className="px-6 py-4">{booking?.status}</td>
                    <td className="px-6 py-4">{formateDate(booking?.date)}</td>
                    <td className="px-6 py-4 cursor-pointer underline underline-offset-2">{booking?.doctorFee}</td>
                    {booking?.status=='canceled'? <td className="px-6 py-4">{booking?.doctorFee ??'-'}</td>   :<td className="px-6 py-4">{'-'}</td>}
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </div>
  )
}

export default PaymentHistory
