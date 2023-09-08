import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../../helper/axios/userAxios";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import moment from "moment";
import { useSelector } from "react-redux";
import { BsCurrencyRupee } from "react-icons/bs";
import { ToastifyContest } from "../../../helper/contest/ToastifyContest";
import "./DoctorDetails.css";
function DoctorDetails() {
  const location = useLocation();
  const reshedule = new URLSearchParams(location.search).get("reschedule");
  const { VITE_SERVER_URL } = import.meta.env;
  const { doctorId } = useParams();
  const [doctorDetails, setDoctorDetails] = useState({});
  const [timeSlotes, setTimeSlotes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollableContainerRef = useRef(null);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [consultaionDetails, setConsultationDetails] = useState({});
  const { show } = useContext(ToastifyContest);

  const [paymentMethod, setPaymentMethod] = useState("");
  const navigate = useNavigate();

  const userId = useSelector((store) => store.user.id);
  const wallet = useSelector((store) => store.user.wallet);

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

  const formateDay = (date) =>{
    let result = moment(date).format('dddd')
    return result
  }

  const formateDate = (date) => {
    let result = moment(date).format("Do MMM YY")
    return result;
  };

  const formatTime = (timee) => {
    let time = moment(timee).format("LT");
    return time;
  };

  const handlePopup = (timeSlot, session) => {
    if (!userId) return show("Login for Slot Booking", 401);
    setConfirmPopup((pre) => !pre);
    let date = moment(timeSlot.start).format("ll");
    setConsultationDetails({
      ["doctorId"]: doctorId,
      ["slot"]: timeSlot,
      ["date"]: date,
      ["sessions"]: session,
      ["userId"]: userId,
      ["paymentMethod"]: reshedule ? "reschedule" : "",
      ["consultationId"]: reshedule ? reshedule : "",
    });
  };
  const getSlotes = (obj) => {
   
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
        else if (response.data.status && response.data.type === "online") {
          localStorage.setItem("myToken", response.data.token);
          window.location.href = response.data.url;
        } else {
          show(response.data.message);
        }
      });
  };

  const timeChecking = (time) => {
    console.log("start");
    let currentTime = moment();
    let startingTime = moment(time);
    console.log(currentTime, "currentTime");
    console.log(startingTime, "startingTime");
    console.log(startingTime.isBefore(currentTime));
    return startingTime.isBefore(currentTime);
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
    <div className="w-full  md:h-[90%] flex flex-col md:flex-row justify-center gap-8 px-5 my-6 ">
      <div className=" w-full md:w-[40%]  h-96 md:h-full py-8 flex flex-col items-center justify-center bg-slate-200 rounded-xl">
        <div className=" flex justify-center w-40 h-40 md:w-56 lg:w-60 lg:h-60 shadow-2xl shadow-black rounded-full overflow-hidden  ">
          <img
            src={`${VITE_SERVER_URL}/images/${doctorDetails.image}`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className=" bg-white p-2 w-[90%] h-[50%] md:h-[40%]  grid grid-cols-2 md:grid-cols-3 px-2 text-sm md:text-base md:px-10 mt-11 mx-auto rounded-lg shadow-2xl">
          <div className=" w-full flex flex-col items-start  justify-center">
            <p className="mb-4">Name </p>
            <p className="mb-4">Specialization </p>
            <p className="mb-4">consultaion Fee </p>
          </div>
          <div className="hidden md:block w-full h-full">
            <div className=" flex flex-col justify-center items-center w-full h-full">
              <span className="mb-4">:</span>
              <span className="mb-4">:</span>
              <span className="mb-4">:</span>
            </div>
          </div>
          <div className="flex flex-col items-end  w-full  justify-center ">
            <div>
              <p className="md:text-xl mb-4">Dr . {doctorDetails.firstName}</p>
            </div>
            <p className="mb-4">{doctorDetails?.specialization?.name}</p>
            <div className="mb-4 flex items-center gap-1">
              <p>{doctorDetails.feePerConsultation}</p>
              <span>
                <BsCurrencyRupee />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className=" md:w-[60%] h-96 md:h-full sessionContainer overflow-y-scroll flex flex-col items-center bg-slate-200 rounded-xl px-2">
        {!confirmPopup && (
          <>
            {" "}
            {!timeSlotes.length && (
              <div className="w-full h-full flex justify-center items-center">
                <p className="text-2xl"> Slotes are not available </p>
              </div>
            )}
            <div
              className={`${
                timeSlotes.length ? "block w-full md:w-5/6 mt-5" : "hidden"
              } mx-3 flex flex-col  `}
            >
              {/* absolute top-0 left-4 md:left-24 shadow-2xl bg-slate-300 py-10 flex flex-col md:grid md:grid-cols-1 lg:grid-cols-[3fr,7fr] gap-4 px-5 */}
              <p>Available Slotes</p>

              <div className="w-full mt-5 md:w-full flex  justify-center sticky top-0 bg-slate-500  p-2 rounded-lg ">
                <div className="w-full gap-4 items-center flex flex-row justify-evenly">
                  <div
                    className="cursor-pointer w-10 p-2 hover:bg-black hover:text-white flex justify-center "
                    onMouseEnter={handleScrollLeft}
                  >
                    <AiOutlineArrowLeft className="" />
                  </div>
                  <div
                    className="flex-1 flex flex-row gap-4 overflow-x-auto datesContainer"
                    ref={scrollableContainerRef}
                  >
                    {timeSlotes?.map((timeSlote, index) => {
                      return (
                        <div
                          className=" bg-[#509393] text-white min-w-max cursor-pointer rounded-lg p-2"
                          key={index}
                          onClick={() => getSlotes(timeSlote)}
                        >
                          <p className="w-full">
                            {formateDate(timeSlote.date)}
                          </p>
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
              <div className="w-full h-full  flex flex-col  ">
                {sessions.length
                  ? sessions.map((session, index) => {
                      return (
                        <div
                          key={index}
                          className=" mb-1  flex flex-col  w-full "
                        >
                          <div className="flex gap-2">
                            <p>Session</p>

                            <p>{session.session}</p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:gird-cols-4 lg:grid-cols-5 gap-3 mx-auto">
                            {session.slots.map((obj, index) => {
                              return (
                                <div
                                  key={index}
                                  className={`${
                                    obj.is_Booked ? "pointer-events-none" : ""
                                  } cursor-pointer  w-32 md:30 `}
                                  // onClick={() =>{
                                  //   setConfirmPopup(pre => !pre)
                                  //   // hadleSlotBooking(obj, session)
                                  // } }
                                  onClick={() => handlePopup(obj, session)}
                                >
                                  <div className=" flex justify-center bg-stone-300 hover:bg-stone-500 hover:text-white border-solid border-teal-500 p-2 rounded-lg ">
                                    <span className="ml-1">
                                      {formatTime(obj.start)}
                                    </span>
                                    <span className="ml-1">-</span>
                                    <span>{formatTime(obj.end)}</span>
                                  </div>
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
          </>
        )}
        {confirmPopup && (
          <div className=" relative top-0 left-0  w-full md:w-5/6 bg-slate-300 rounded-lg px-2 md:px-5 py-8 mt-10 ">
            <div className="w-full flex justify-center my-3 ">
                <h2 className="underline underline-offset-8 font-bold text-lg" >Booking Details</h2>
              </div>
              <div className="absolute top-5 right-10 cursor-pointer w-[2em] h-[1em]">
                {/* <span className="w-[.1em] bg-[#fff] rotate-[45deg] h-7"></span>
            <span className=" w-[.1em] bg-[#fff] rotate-[-45deg] h-7" ></span>
            <div className="w-full h-full bg-red-600 "></div> */}
                <p
                  className="rotate-45 text-3xl hover:text-red-700"
                  onClick={() => setConfirmPopup(false)}
                >
                  +
                </p>
              </div>
            <div className="w-full h-full flex flex-col justify-center items-center ">
              
             <div className="md:w-3/4 grid grid-cols-3 ">
             <div className="flex flex-col  md:justify-center gap-5 md:gap-2 " >
                <p>Date</p>
                <p>Day</p>
                <p>Starting <span className=" hidden md:block">Time</span></p>
                <p>Ending <span className="hidden md:block">Time</span></p>
              </div>
              <div className="flex flex-col items-center md:justify-center gap-5 md:gap-2  ">
                  <span>:</span>
                  <span>:</span>
                  <span>:</span>
                  <span>:</span>
              </div>
              <div className="flex flex-col md:justify-center  gap-5 md:gap-2  " >
                <p>{formateDate(consultaionDetails.date)}</p>
                <p>{formateDay(consultaionDetails.date)}</p>
                <p>{formatTime(consultaionDetails?.slot?.start)}</p>
                <p>{formatTime(consultaionDetails?.slot?.end)}</p>
              </div>
             </div>
             <div className="flex justify-center w-full gap-2 my-2 text-red-500 font-bold">
                <p className="font-bold">Your Wallet </p>
                <p>:</p>
                <p>{wallet}</p>
              </div>
              <div className="flex gap-3">
                {reshedule ? (
                  ""
                ) : (
                  <>
                    <div className="flex justify-center items-center gap-2">
                      <label htmlFor="">Wallet</label>
                      <input
                        type="radio"
                        name="pay_method"
                        value="wallet"
                        checked={paymentMethod === "wallet"}
                        onChange={handlePaymentChange}
                        className="w-4 h-4 "
                      />
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <label htmlFor="">Online</label>

                      <input
                        type="radio"
                        name="pay_method"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={handlePaymentChange}
                        className="w-4 h-4    rounded-full"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="my-4 w-full flex justify-center  ">
                <button
                  className="p-2 bg-green-700 hover:shadow-lg hover:shadow-green-700 text-gray-50 rounded-lg "
                  onClick={hadleSlotBooking}
                >
                  Confirm Appointment
                </button>
              </div>
              
              {/* <div className=" flex flex-col gap-4 ">
                <h1 className="underline underline-offset-4">
                  Consultation Time
                </h1>

                <p>
                  starting Time :{" "}
                  <span></span>
                </p>
                <p>
                  Ending Time :{" "}
                  <span></span>
                </p>
              </div> */}
              
              
            
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDetails;
