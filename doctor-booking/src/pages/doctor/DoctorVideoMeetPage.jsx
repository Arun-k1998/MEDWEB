import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import userApi from "../../helper/axios/userAxios";
function DoctorVideoMeetPage() {
  const domain = "meet.jit.si";
  let api = {};
  let { id } = useParams();
  let initialValues={
    medicine:'',
    totalDays:'',
    time:{

    }
  }
  const [meetingId, setMeetingId] = useState({});
  const [medicines,setMedicines] = useState([{}])

  useEffect(() => {
    userApi.get(`/meet/${id}`).then((res) => {
      if (res.data.status) {
        setMeetingId({ ...res.data.meetingId });
      }
    });
  }, []);

  // const startMeet = useCallback(() => {
  //   const options = {
  //     roomName: meetingId.videoCallId,
  //     width: "100%",
  //     height: 500,
  //     configOverwrite: { prejoinPageEnabled: false },
  //     interfaceConfigOverwrite: {
  //       // overwrite interface properties if you want
  //     },
  //     // VIDEO FRAME WILL BE ADDED HERE
  //     parentNode: document.querySelector("#jitsi-iframe"),
  //     userInfo: {
  //       displayName: meetingId?.doctorId?.firstName,
  //     },
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   api = new window.JitsiMeetExternalAPI(domain, options);

  //   api.addEventListeners({
  //     readyToClose: handleClose,
  //     participantLeft: handleParticipantLeft,
  //     participantJoined: handleParticipantJoined,
  //     videoConferenceJoined: handleVideoConferenceJoined,
  //     videoConferenceLeft: handleVideoConferenceLeft,
  //   });
  // }, [api]);

  // useEffect(() => {
  //   if (meetingId) {
  //     if (window.JitsiMeetExternalAPI) {
  //       startMeet();
  //     } else {
  //       alert("JitsiMeetExternalAPI not loaded");
  //     }
  //   }
  // }, [startMeet]);

  // // ALL OUR HANDLERS
  // const handleClose = () => {
  //   console.log("handleClose");
  // };

  // const handleParticipantLeft = async (participant) => {
  //   console.log("handleParticipantLeft", participant);
  //   await getParticipants();
  // };

  // const handleParticipantJoined = async (participant) => {
  //   console.log("handleParticipantJoined", participant);
  //   await getParticipants();
  // };

  // const handleVideoConferenceJoined = async (participant) => {
  //   console.log("handleVideoConferenceJoined", participant);
  //   await getParticipants();
  // };

  // const handleVideoConferenceLeft = () => {
  //   console.log("handleVideoConferenceLeft");
  //   history.push("/thank-you");
  // };

  // // GETTING ALL PARTICIPANTS
  // const getParticipants = () => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve(api.getParticipantsInfo());
  //     }, 500);
  //   });
  // };

  const handleAddMore = ()=>{
    setMedicines(prev=>{
      return [
        ...prev,{}
    ]
    })
  }

  const handleChange = (e,index)=>{
   const {name,value} = e.target.value
   const allMedicine = [...medicines]
   allMedicine[index][name] = value
   setMedicines([...allMedicine])
  }

  return (
    <div className="grid grid-cols-2 gap-4 bg-orange-400">
      {/* <header
        style={{
          backgroundColor: "rgb(10, 25, 41)",
          color: "white",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, padding: 10 }}>Meeting name</p>
      </header> */}
      <div id="jitsi-iframe" style={{ marginBottom: 0 }}></div>
      {/* <div
        style={{
          backgroundColor: "rgb(10, 25, 41)",
          height: "20vh",
          margin: 0,
        }}
      ></div> */}
      <div className="fixed bg-slate-500 h-full  top-0 right-0 w-1/2 ml-10">
        <div className="w-full h-full bg-red-500 py-10 px-5">
          <div className="w-full h-full bg-red-300 px-1">
            {
              medicines.map((medine,index)=>{
                return (
                  <>
                  <div className="grid grid-cols-5 gap-1 my-2 ">
              <div className="w-full">
                <label htmlFor="">Medicine</label>
                <input type="text" name='medicine' className="w-full" />
              </div>
              <div className="w-full flex flex-col items-center justify-center">
                <label htmlFor="">Quantity</label>
                <input type="Number" name="quantity" className="w-full" />
                
              </div>
              <div className="w-full">
                <label htmlFor="">Days</label>
                <input type="Number" name="totalDays" className="w-full" />
                
              </div>
              
              <div className="flex items-center w-full justify-around ml-2">
                <div className="flex flex-col">
                  <label htmlFor="">M</label>
                  <input type="checkbox" name="morning" value={'morning'} />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">AN</label>
                  <input type="checkbox" name="afterNoon" value={'afterNoon'} />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="">N</label>
                  <input type="checkbox" name="night" value={'night'} />
                </div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div>
                  <label htmlFor="">AF</label>
                <input type="checkbox" name="afterFood" value={'after'}  />
                </div>
                <div>
                  <label htmlFor="">BF</label>
                <input type="checkbox" name="beforeFood" value={'before'} />
                </div>
              </div>
              
             
            </div>
            <hr />
            </>
                )
              })
            }
             <button onClick={handleAddMore} className="bg-amber-700 mt-5 p-2 rounded-lg text-white">Add More</button>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorVideoMeetPage;
