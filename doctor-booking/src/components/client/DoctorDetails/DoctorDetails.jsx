import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../helper/axios/userAxios";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import moment from "moment";
import { useSelector } from "react-redux";
import {BsCurrencyRupee} from 'react-icons/bs'
function DoctorDetails() {
  const { VITE_SERVER_URL } = import.meta.env;
  const { doctorId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState({});
  const [timeSlotes, setTimeSlotes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollableContainerRef = useRef(null);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [consultaionDetails, setConsultationDetails] = useState({});
  const userId = useSelector((store) => store.user.id);
  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const handleScrollRight = () => {
    if (scrollableContainerRef.current) {
      const newScrollLeft = scrollLeft + 300; // Adjust the scroll distance as needed
      scrollableContainerRef.current.scrollLeft = newScrollLeft;
      setScrollLeft(newScrollLeft);
    }
  };

  const handleScrollLeft = () => {
    if (scrollableContainerRef.current) {
      const newScrollLeft = scrollLeft - 300; // Adjust the scroll distance as needed
      scrollableContainerRef.current.scrollLeft = newScrollLeft;
      setScrollLeft(newScrollLeft);
    }
  };

  const formateDate = (date) => {
    let result = moment(date).format("LL");
    return result;
  };

  const formatTime = (timee) => {
    let time = moment(timee).format("LT");
    return time;
  };

  const handlePopup = (timeSlot, session) => {
    setConfirmPopup((pre) => !pre);
    let date = moment(timeSlot.start).format("ll");
    setConsultationDetails({
      ["doctorId"]: doctorId,
      ["slot"]: timeSlot,
      ["date"]: date,
      ["sessions"]: session,
      ["userId"]: userId,
    });
  };
  const getSlotes = (obj) => {
    console.log(obj);
    let sessions = obj.sessions.map((session) => {
      // return {
      //   dateId:session._id,
      //   doctorId: obj.doctorId,
      //   session: session.session,
      //   slots: session.slotes,
      // };
      return {
        dateId: obj._id,
        doctorId: obj.doctorId,
        session: session.session,
        slots: session.slotes,
      };
    });
    console.log("sessionsss");

    setSessions([...sessions]);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
    setConsultationDetails((prev) => {
      return { ...prev, ["paymentMethod"]: e.target.value };
    });
  };

  const hadleSlotBooking = () => {
    // console.log(timeSlot);
    // console.log("slot booking");
    // console.log(session);
    // let date = moment(timeSlot.start).format("ll");
    // console.log(date);
    // setConsultationDetails({ doctorId: doctorId, slot: timeSlot, date: date });
    // api
    //   .post("/booking", {
    //     doctorId: doctorId,
    //     slot: timeSlot,
    //     date: date,
    //     userId: userId,
    //     session: session,
    //   })
    // -----------------------------------------------booking below---------
    // console.log(consultaionDetails);
    // api.post("/booking", consultaionDetails).then((res) => {
    //   if (res.data.status) {
    //     alert("Hello");
    //   }
    // });
    // setConsultationDetails(prev =>{
    //   return {...prev,['paymentMethod'] : paymentMethod}
    // })
    console.log(consultaionDetails);
    // alert(paymentMethod)
    // alert(paymentMethod);
    // const requestData = { doctorId: doctorId };

    api
      .post("/create-checkout-session", consultaionDetails)
      .then((response) => {
        console.log(response.data);
        console.log(response.data.token);
        if (response.data.status && response.data.type === "wallet")
          navigate("/payment/success");
        else if (response.data.type === "online") {
          alert("in");
          localStorage.setItem("myToken", response.data.token);
          window.location.href = response.data.url;
        } else {
          alert(response.data.message);
        }
      });
  };
  useEffect(() => {
    if (doctorId) {
      api.get(`/timeSlotes/${doctorId}`).then((response) => {
        if (response.data.status) {
          // console.log(response.data.timeSlotes);
          setTimeSlotes([
            ...response.data.timeSlotes.filter((date) => {
              if (moment(date?.date).isSameOrAfter(moment(), "day")) {
                // console.log(date);
                date.sessions = date.sessions.map((session) => {
                  session.slotes = session.slotes.filter((slot) => {
                    return moment(slot.start).isSameOrAfter(
                      moment().add(20, "minutes")
                    );
                  });
                  return session;
                });
                return true;
              }
              return false;
            }),
          ]);
          setDoctorDetails({ ...response.data.doctorData });
          setSessions([]);
        }
      });
    }
  }, [doctorId]);

  return (
    <div className="w-full h-full flex justify-center gap-8  my-6">
      <div className="w-[40%] flex flex-col items-start bg-slate-200">
        <div className=" flex justify-center  mt-10 w-full">
          <img
            src={`${VITE_SERVER_URL}/images/${doctorDetails.image}`}
            alt=""
          />
        </div>
        <div className="w-full grid grid-cols-3 px-10 mt-11">
          <div className="">
            <p className="mb-4">Name </p>
            <p className="mb-4">Specialization </p>
            <p className="mb-4">consultaion Fee </p>
          </div>
          <div className="flex flex-col">
            <span className="mb-4">:</span>
            <span className="mb-4">:</span>
            <span className="mb-4">:</span>
          </div>
          <div>
            <div>
              <p className="text-xl mb-4">Dr . {doctorDetails.firstName}</p>
            </div>
            <p className="mb-4">{doctorDetails?.specialization?.name}</p>
            <div className="mb-4 flex items-center gap-1">
              <p>{doctorDetails.feePerConsultation}</p>
              <span><BsCurrencyRupee /></span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[60%] flex flex-col items-center bg-slate-200">
        {!confirmPopup && (
          <div
            className={`${
              timeSlotes.length ? "block w-full md:w-5/6 mt-5" : "hidden"
            } mx-3 flex flex-col  `}
          >
            {/* absolute top-0 left-4 md:left-24 shadow-2xl bg-slate-300 py-10 flex flex-col md:grid md:grid-cols-1 lg:grid-cols-[3fr,7fr] gap-4 px-5 */}
            <p>Available Slotes</p>

            <div className="w-full mt-5  md:w-full flex  justify-center bg-slate-600">
              <div className="w-full gap-4 items-center flex flex-row justify-evenly">
                <div
                  className="cursor-pointer w-10 p-2 hover:bg-black hover:text-white flex justify-center"
                  onMouseEnter={handleScrollLeft}
                >
                  <AiOutlineArrowLeft className="" />
                </div>
                <div
                  className="flex-1 flex flex-row gap-4 overflow-x-auto"
                  ref={scrollableContainerRef}
                >
                  {timeSlotes?.map((timeSlote, index) => {
                    return (
                      <div
                        className="p-1 bg-[#509393] text-white min-w-max cursor-pointer"
                        key={index}
                        onClick={() => getSlotes(timeSlote)}
                      >
                        <p className="w-full">{formateDate(timeSlote.date)}</p>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="cursor-pointer w-10 hover:bg-black hover:text-white p-2 flex justify-center"
                  onMouseEnter={handleScrollRight}
                >
                  <AiOutlineArrowRight className="" />
                </div>
              </div>
            </div>

            {/* ------------------- */}
            <div className="w-full flex flex-col ">
              {sessions.length
                ? sessions.map((session, index) => {
                    return (
                      <div key={index} className=" mb-1 flex flex-col  w-full ">
                        <div className="flex gap-2">
                          <p>Session</p>

                          <p>{session.session}</p>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                          {session.slots.map((obj, index) => {
                            return (
                              <div
                                key={index}
                                className={`${
                                  obj.is_Booked ? "pointer-events-none" : ""
                                } cursor-pointer  w-30`}
                                // onClick={() =>{
                                //   setConfirmPopup(pre => !pre)
                                //   // hadleSlotBooking(obj, session)
                                // } }
                                onClick={() => handlePopup(obj, session)}
                              >
                                <p className=" flex justify-center bg-stone-300 hover:bg-stone-500 hover:text-white border-solid border-teal-500 p-2">
                                  <span className="ml-1">
                                    {formatTime(obj.start)}
                                  </span>
                                  <span className="ml-1">-</span>
                                  <span>{formatTime(obj.end)}</span>
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        <hr className="my-3" />
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        )}
        {confirmPopup && (
          <div className=" relative top-0 left-0   w-5/6 bg-slate-300 px-5 py-8 mt-10 ">
            <div className="w-full h-full flex flex-col items-center ">
              <div>
                <h2>Booking Details</h2>
              </div>
              <div className="absolute top-5 right-10 cursor-pointer w-[2em] h-[1em]">
                {/* <span className="w-[.1em] bg-[#fff] rotate-[45deg] h-7"></span>
            <span className=" w-[.1em] bg-[#fff] rotate-[-45deg] h-7" ></span>
            <div className="w-full h-full bg-red-600 "></div> */}
                <p onClick={() => setConfirmPopup(false)}>close</p>
              </div>
              <div>
                <p>session {consultaionDetails?.session?.session}</p>
              </div>
              <div>
                <h1 className="underline underline-offset-4">
                  Consultation Time
                </h1>

                <p>
                  starting Time :{" "}
                  <span>{formatTime(consultaionDetails?.slot?.start)}</span>
                </p>
                <p>
                  Ending Time :{" "}
                  <span>{formatTime(consultaionDetails?.slot?.end)}</span>
                </p>
              </div>
              <div className="flex gap-3">
                <div>
                  <label htmlFor="">Wallet</label>
                  <input
                    type="radio"
                    name="pay_method"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={handlePaymentChange}
                  />
                </div>
                <div>
                  <label htmlFor="">Online</label>
                  <input
                    type="radio"
                    name="pay_method"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={handlePaymentChange}
                  />
                </div>
              </div>
              <div>
                <button
                  className="p-2 bg-orange-300 text-gray-50"
                  onClick={hadleSlotBooking}
                >
                  Confirm Appointment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDetails;
