import React, { useContext, useEffect, useState } from "react";
import { ToastifyContest } from "../../helper/contest/ToastifyContest";
import { useParams } from "react-router-dom";
import { doctorApi } from "../../helper/axios/doctorAxios";
import userApi from "../../helper/axios/userAxios";

function Prescription() {
  const { consultationid } = useParams();
  let initialValues = {
    medicine: "",
    totalDays: 0,
    quantity: 0,
    // morning: false,
    // afterNoon: false,
    // night: false,
    // af: false,
    // bf: false,
  };
  const [medicines, setMedicines] = useState([initialValues]);
  const [consultation, setConsultation] = useState({});
  const { show } = useContext(ToastifyContest);

  const handleAddMore = () => {
    setMedicines((prev) => {
      return [...prev, initialValues];
    });
  };

  const handleChange = (e, index) => {
    const { name, value, checked } = e.target;

    if (name === "medicine" || name === "totalDays" || name === "quantity") {
      const allMedicine = [...medicines];
      allMedicine[index][name] = value;
      setMedicines([...allMedicine]);
    } else {
      const allMedicines = [...medicines];
      allMedicines[index][name] = checked;
      setMedicines([...allMedicines]);
    }
    console.log(medicines);
  };
  const handlePrescriptionSubmit = () => {
    const meetId = consultation._id;
    alert(meetId);
    doctorApi
      .post("/prescription-c", { meetId:consultation._id, medicines })
      .then((res) => {
        if (res.data.status) {
          show("successfully Added prescription");
        }
      });
  };

  useEffect(() => {
    if (consultationid) {
      userApi.get(`/meet/${consultationid}`).then((res) => {
        if (res.data.status) {
          console.log(res.data);
          setConsultation({ ...res.data.meetingId });
        }
      });
    }
  }, [consultationid]);
  return (
    <div className="w-full h-full flex justify-center">
    <div className="fixed  h-full w-1/2 ml-10">
      <div className="w-full h-full  py-10 px-5">
        <div className="w-full h-full bg-slate-100 shadow-lg py-4 px-4">
          <div className="w-full flex justify-center">
            <p className="text-lg underline underline-offset-8">Prescription</p>
          </div>
          <div>
            <div className="flex gap-3 my-5">
              <p>Patient Name : </p>
              <span>{consultation?.userId?.firstName}</span>
            </div>
            <div className="flex gap-3 my-5">
              <p>Patient email : </p>
              <span>{consultation?.userId?.email}</span>
            </div>
          </div>
    <hr className="h-3 border-none bg-slate-700 rounded-lg" />
          {medicines.map((medicine, index) => {
            return (
              <>
                <div className="grid grid-cols-5 gap-1 my-2 ">
                  <div className="w-full">
                    <label htmlFor="">Medicine</label>
                    <input
                      type="text"
                      name="medicine"
                      value={medicine?.medicine}
                      className="w-full border-2"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                  <div className="w-full flex flex-col items-center justify-center">
                    <label htmlFor="">Quantity</label>
                    <input
                      type="Number"
                      name="quantity"
                      value={medicine?.quantity}
                      className="w-full border-2"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                  <div className="w-full">
                    <label htmlFor="">Days</label>
                    <input
                      type="Number"
                      name="totalDays"
                      value={medicine?.totalDays}
                      className="w-full border-2"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>

                  <div className="flex items-center w-full justify-around ml-2">
                    <div className="flex flex-col">
                      <label htmlFor="">M</label>
                      <input
                        type="checkbox"
                        name="morning"
                        checked={medicine?.morning}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="">AN</label>
                      <input
                        type="checkbox"
                        name="afterNoon"
                        checked={medicine?.afterNoon}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="">N</label>
                      <input
                        type="checkbox"
                        name="night"
                        checked={medicine?.night}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <div>
                      <label htmlFor="">AF</label>
                      <input
                        type="checkbox"
                        name="af"
                        checked={medicine?.af}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                    <div>
                      <label htmlFor="">BF</label>
                      <input
                        type="checkbox"
                        name="bf"
                        checked={medicine?.bf}
                        onChange={(e) => handleChange(e, index)}
                      />
                    </div>
                  </div>
                </div>
                <hr />
              </>
            );
          })}
          <button
            onClick={handleAddMore}
            className="bg-amber-700 mt-5 p-2 rounded-lg text-white"
          >
            Add More
          </button>
          <div className="w-full flex justify-center">
            <button
              className="p-2 bg-green-800 w-28 h-10 text-center text-white rounded-xl hover:w-32 hover:h-12"
              onClick={handlePrescriptionSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Prescription;
