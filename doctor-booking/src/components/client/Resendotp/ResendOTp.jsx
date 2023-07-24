import React from 'react'

function ResendOTp() {
  const resendOTP = ()=>{
    
  }
  return (
<div className="md:w-[50%] lg:w-[25%] h-max-h-fit bg-cyan-100 p-4 flex flex-col justify-center items-center rounded-2xl shadow-2xl text-center ">
          <div>
            <h1 className="font-serif text-xl">Verify OTP</h1>
          </div>
          <div className="flex flex-col justify-center items-center text-center mt-6 w-full">
            <input
              type="number"
              placeholder="Enter OTP"
              value={formValues.otp}
              name="otp"
              onChange={handleChange}
              required
              className="p-2 mb-5 rounded-xl w-full "
            />
            <button
              className="rounded bg-cyan-500 hover:bg-cyan-600 p-2 w-2/4 mb-5 "
              onClick={otpSubmit}
            >
              Verirfy
            </button>
            <div>
              {timer > 0 ? (
                <p>Resend OTP in {formatTime(timer)}</p>
              ) : (
                <p className="hover:text-red-500 hover:cursor-pointer" onClick={resendOTP} >
                  Click here to resend otp
                </p>
              )}
            </div>
          </div>
        </div>
  )
}

export default ResendOTp
