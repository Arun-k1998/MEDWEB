import React, { useEffect } from "react";
import api from "../../helper/axios/userAxios";
import { useLocation, useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const session_id = queryParams.get("session_id");
  const navigate = useNavigate();
  const jwt = localStorage.getItem("myToken");
  useEffect(() => {
    if (jwt && session_id) {
      api
        .post("/payment-succes", { booking: jwt, paymentId: session_id })
        .then((res) => {
        
          localStorage.removeItem("myToken");
        });
    }
  }, [session_id]);
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center">
      <h1 className="text-xl"> Success</h1>
      <button
        className=" p-2 text-white bg-lime-600 mt-6"
        onClick={() => navigate("/")}
      >
        Go Home
      </button>
    </div>
  );
}

export default PaymentSuccessPage;
