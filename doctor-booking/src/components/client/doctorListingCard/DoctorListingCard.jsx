import React, { useEffect, useState } from "react";
import api from "../../../helper/axios/userAxios";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import moment from "moment";

function DoctorListingCard({ doctors }) {
  const { VITE_SERVER_URL } = import.meta.env;
  const [timeSlotes, setTimeSlotes] = useState([]);
  const [limit, setLimit] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [nu, setNu] = useState({});

  const handleclick = (id) => {
    api.get(`/timeSlotes/${id}`).then((response) => {
      if (response.data.status) {
        setNu({
          start: 0,
          end: 5,
        });
        setTimeSlotes([...response.data.timeSlotes]);
        setLimit([
          ...response.data.timeSlotes.filter((time, index) => {
            if (index < nu.end) {
              return time;
            }
          }),
        ]);
        setSessions([])
      }
    });
  };

  const getSlotes = (obj) => {
    let sessions = obj.sessions.map((obj) => {
      return { session: obj.session, slots: obj.slotes };
    });
    console.log("sessionsss");

    setSessions([...sessions]);
  };

  const nextHandler = () => {
    setNu((pre) => {
      return { start: pre.end, end: 2 * pre.end };
    });
  };

  const formateDate = (date) => {
    let result = moment(date).format("LL");
    return result;
  };

  const formatTime = (timee) => {
    let time = moment(timee).format("LT");
    return time;
  };
  useEffect(() => {
    console.log("limit");
    console.log(timeSlotes);
    timeSlotes?.length
      ? setLimit((pre) => {
          return [
            ...timeSlotes.filter((time, index) => {
              if (index <= nu.end && index >= nu.start) {
                console.log(nu.end, nu.start);
                return time;
              }
            }),
          ];
        })
      : console.log("nothing");
  }, [nu]);
  return (
    <div className="mt-10 flex flex-col items-center justify-center">
      {doctors.map((doctor, index) => {
        return (
          <div
            key={index}
            className="w-5/6 h-60  p-5 bg-slate-100 flex justify-center"
          >
            <div className="flex justify-start w-full">
              <div className="w-44 flex  h-full rounded-full overflow-hidden  ">
                <img
                  src={`${VITE_SERVER_URL}/images/${doctor.image}`}
                  className="object-cover h-full w-full rounded-full "
                />
              </div>
              <div className="ml-4 flex flex-col justify-evenly ">
                <p>{`${doctor.firstName} ${doctor.lastName}`}</p>
                <p>{doctor.specialization.name}</p>
                <p>Experience : 6years</p>
                <strong>Consultation Fee: 100</strong>
              </div>
            </div>

            <div className=" flex flex-col justify-center">
              <div className="w-32 mb-4">
                <button
                  className="bg-white p-2 rounded-xl w-full "
                  onClick={() => handleclick(doctor._id)}
                >
                  Book Slot
                </button>
              </div>
              <div className="w-32">
                <button className="bg-white p-2 rounded-xl w-full ">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        );
      })}
      <div
        className={`${timeSlotes.length ? " block w-5/6 mt-5 " : " hidden "} `}
      >
        {limit?.length ? (
          <>
            <div className="w-full gap-3 flex justify-evenly items-center  ">
              <AiOutlineArrowLeft />
              {limit?.map((timeSlote, index) => {
                return (
                  <div
                    className="bg-slate-200 text-white p-2"
                    key={index}
                    onClick={() => getSlotes(timeSlote)}
                  >
                    <div>
                      <p>{formateDate(timeSlote.date)}</p>
                    </div>
                    <div></div>
                  </div>
                );
              })}
              <AiOutlineArrowRight
                className="cursor-pointer"
                onClick={nextHandler}
              />
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col w-5/6 mt-3 ">
        {sessions.length
          ? sessions.map((obj, index) => {
              return (
                <div key={index} className=" mb-1flex justify-between items-center w-full cursor-pointer ">
                  <div className="flex gap-2">
                    <p>Session</p>
                    <p>{obj.session}</p>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {obj.slots.map((obj) => {
                      
                      return (
                        <div className="">
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
    </div>
  );
}

export default DoctorListingCard;
