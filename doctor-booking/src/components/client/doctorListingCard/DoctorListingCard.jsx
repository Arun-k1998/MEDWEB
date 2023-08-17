import React, { useEffect, useRef, useState } from "react";
import api from "../../../helper/axios/userAxios";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import moment from "moment";
import "./doctorListingCard.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function DoctorListingCard({ doctors }) {
  const { VITE_SERVER_URL } = import.meta.env;
  const navigate = useNavigate()
  const [timeSlotes, setTimeSlotes] = useState([]);
  const [limit, setLimit] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [nu, setNu] = useState({});
  const [scrollLeft, setScrollLeft] = useState(0);
  const [confirmPopup, setConfirmPopup] = useState(false);
  const [consultaionDetails, setConsultationDetails] = useState({});
  const [doctorId, setDoctorId] = useState("");
  const scrollableContainerRef = useRef(null);
  const userId = useSelector((store) => store.user.id);
  const [doctorsHide, setDoctorsHide] = useState(false);
 

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

  const handleclick = (id) => {
    api.get(`/timeSlotes/${id}`).then((response) => {
      if (response.data.status) {
        setNu({
          start: 0,
          end: 5,
        });
        // console.log(response.data.timeSlotes);
        setTimeSlotes([
          ...response.data.timeSlotes
          .filter((date) => {
            if (moment(date?.date).format("ll") >= moment().format("ll")) {
              date.sessions = date.sessions.map((session) => {
                session.slotes = session.slotes.filter((slot) => {
                  return (
                    moment(slot.start).format() >=
                    moment().add(20, "minutes").format()
                  );
                });
                return session;
              });
              return true;
            }
            return false;
          })
        ]);
        setLimit([
          ...response.data.timeSlotes.filter((time, index) => {
            if (index < nu.end) {
              return time;
            }
          }),
        ]);
        setSessions([]);
      }
    });
    setDoctorId(id);
    setDoctorsHide(true);
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

  const nextHandler = () => {
    setNu((pre) => {
      return { start: pre.end, end: 2 * pre.end };
    });
  };

  const previousHandler = () => {
    setNu((prev) => {
      return { start: "dd", end: prev.start };
    });
  };

  const formateDate = (date) => {
    let result = moment(date).format("LL");
    return result;
  };

  const handlePopup = (timeSlot,session)=>{
    setConfirmPopup(pre=>!pre)
    let date = moment(timeSlot.start).format("ll");
    setConsultationDetails({ ['doctorId']: doctorId, ['slot']: timeSlot, ['date']: date,['session']: session,['userId']: userId });

  }

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
    // console.log(consultaionDetails);
    // api
    // .post("/booking",consultaionDetails)
    //   .then((res) => {
    //     if (res.data.status) {
    //       alert("Hello");
    //     }
    //   });
  };

  const formatTime = (timee) => {
    let time = moment(timee).format("LT");
    return time;
  };
  // useEffect(() => {
  //   console.log("limit");
  //   console.log(timeSlotes);
  //   timeSlotes?.length
  //     ? setLimit((pre) => {
  //         return [
  //           ...timeSlotes.filter((time, index) => {
  //             if (index <= nu.end && index >= nu.start) {
  //               console.log(nu.end, nu.start);
  //               return time;
  //             }
  //           }),
  //         ];
  //       })
  //     : console.log("nothing");
  // }, [nu]);

  console.log(timeSlotes);

  return (
    <div className={`${doctorsHide? '': 'items-center'} relative  flex   justify-center  w-[80vw]  `}>
      {!doctorsHide && (
        <div className=" w-full grid grid-cols-4 h-full">
          {doctors.length
            ? doctors.map((doctor, index) => {
                return (
                  // <div
                  //   key={index}
                  //   className="w-5/6 h-60  p-5  flex justify-center rounded-lg"
                  // >
                  //   <div className="flex justify-start w-full">
                  //     <div className="w-40 flex  h-full rounded-full overflow-hidden p-1 bg-[#0e5c5c]  ">
                  //       <img
                  //         src={`${VITE_SERVER_URL}/images/${doctor?.image}`}
                  //         className="object-cover h-full w-full rounded-full border-2 border-solid border-white "
                  //       />
                  //     </div>
                  //     <div className="ml-4 flex flex-col justify-evenly ">
                  //       <p>{`${doctor?.firstName} ${doctor?.lastName}`}</p>
                  //       <p>{doctor?.specialization?.name}</p>
                  //       <p>Experience : 6years</p>
                  //       <strong>Consultation Fee: 100</strong>
                  //     </div>
                  //   </div>

                  //   <div className=" flex flex-col justify-center">
                  //     <div className="w-32 mb-4">
                  //       <button
                  //         className="bg-[#165C34] hover:bg-[#09381d] text-white p-2 rounded-xl w-full "
                  //         onClick={() => handleclick(doctor._id)}
                  //       >
                  //         Book Slot
                  //       </button>
                  //     </div>
                  //     <div className="w-32">
                  //       <button className="bg-[#165C34] text-white p-2 rounded-xl w-full ">
                  //         View Profile
                  //       </button>
                  //     </div>
                  //   </div>
                  // </div>
                  <div className="h-72 w-full  border-r-2 border-b-2 border-r-[#189AB4] border-b-[#189AB4] flex flex-col items-center py-5 " key={index}>
                    <div className="w-[40%] h-[60%] rounded-full   ">
                      <img
                        src={`${VITE_SERVER_URL}/images/${doctor?.image}`}
                        className="object-cover h-full w-full rounded-full border-2 border-solid border-white "
                      />
                    </div>
                    <div className=" w-[60%] p-2 flex flex-col justify-center items-center mt-3 h-[20%]">
                      <p> {`Dr. ${doctor?.firstName} ${doctor?.lastName}`}</p>
                      <p className="text-gray-500">
                        {doctor?.specialization?.name}
                      </p>
                      <p className="text-gray-500">
                        {doctor?.feePerConsultation}
                      </p>
                    </div>
                    <div className="mt-3 p-1 h-[20%]">
                      <p
                        className="underline underline-offset-4 cursor-pointer "
                        // onClick={() => handleclick(doctor._id)}
                        onClick={() => navigate(`/consult/detail/${doctor._id}`)}
                      >
                        Book Now
                      </p>
                    </div>
                  </div>
                );
              })
            : "Sorry. No doctors availabl in this name"}
        </div>
      )}

      {doctorsHide && (
     <div className={`${
      timeSlotes.length ? "block w-full md:w-5/6 mt-5" : "hidden"
    } mx-3 flex flex-col  `}>
      {/* absolute top-0 left-4 md:left-24 shadow-2xl bg-slate-300 py-10 flex flex-col md:grid md:grid-cols-1 lg:grid-cols-[3fr,7fr] gap-4 px-5 */}
      <div className="md:w-full lg:w-96 bg-slate-600">
        <img src="https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg" alt="" />
      </div>
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
      <div className="w-full flex flex-col ">
      {sessions.length
          ? sessions.map((session, index) => {
              return (
                <div
                  key={index}
                  className=" mb-1 flex flex-col  w-full "
                >
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
                          onClick={()=> handlePopup(obj,session)}
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
      {confirmPopup && (
        <div className=" absolute top-10 w-5/6 bg-slate-300 px-5 py-8 flex flex-col items-center ">
          
          <div>
            <h2>Booking Details</h2>
          </div>
          <div className="absolute top-5 right-10 cursor-pointer w-[2em] h-[1em]">
            {/* <span className="w-[.1em] bg-[#fff] rotate-[45deg] h-7"></span>
            <span className=" w-[.1em] bg-[#fff] rotate-[-45deg] h-7" ></span>
            <div className="w-full h-full bg-red-600 "></div> */}
            <p onClick={()=>setConfirmPopup(false)} >close</p>
         
          </div>
          <div>
            <p>{consultaionDetails?.session?.session}</p>
          </div>
          
          <div>
            <button className="p-2 bg-orange-300 text-gray-50" onClick={hadleSlotBooking}>Confirm Appointment</button>
          </div>
        </div>
      )}
      

    </div>
    
      )}
      {/* <div
        className={`${timeSlotes.length ? " block w-5/6 mt-5 " : " hidden "} `}
      >
        <div className="w-full gap-4 items-center flex flex-row  justify-evenly   ">
          <div
            className="cursor-pointer w-[5%] p-2 hover:bg-black hover:text-white flex justify-center"
            onMouseEnter={handleScrollLeft}
          >
            <AiOutlineArrowLeft className="   " />
          </div>
          <div
            className="w-[90%] flex flex-row gap-4 overflow-x-scroll scrollable-container "
            ref={scrollableContainerRef}
          >
            {timeSlotes?.map((timeSlote, index) => {
              return (
                <div
                  className=" p-1 bg-[#509393] text-white min-w-max cursor-pointer  "
                  key={index}
                  onClick={() => getSlotes(timeSlote)}
                >
                  <p className="w-full">{formateDate(timeSlote.date)}</p>
                </div>
              );
            })}
          </div>
          <div
            className="cursor-pointer w-[5%] hover:bg-black hover:text-white p-2 flex justify-center"
            onMouseEnter={handleScrollRight}
          >
            <AiOutlineArrowRight className="" />
          </div>
        </div>
      </div> */}
      {/* <div className="flex flex-col w-5/6 mt-3 ">
        {sessions.length
          ? sessions.map((session, index) => {
              return (
                <div
                  key={index}
                  className=" mb-1flex justify-between items-center w-full cursor-pointer "
                >
                  <div className="flex gap-2">
                    <p>Session</p>

                    <p>{session.session}</p>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {session.slots.map((obj, index) => {
                      return (
                        <div
                          key={index}
                          className={`${
                            obj.is_Booked ? "pointer-events-none" : ""
                          }`}
                          onClick={() => hadleSlotBooking(obj, session)}
                        >
                          <p className=" bg-stone-300 hover:bg-stone-500 hover:text-white border-solid border-teal-500 p-2">
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
      {confirmPopup && (
        <div className="absolute top-10 w-5/6 bg-slate-100 px-5 py-8 flex flex-col items-center ">
          <div>
            <h2>Booking Details</h2>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default DoctorListingCard;
