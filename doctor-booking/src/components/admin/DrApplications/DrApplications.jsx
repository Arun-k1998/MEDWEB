import React, { useEffect, useState } from "react";
import { adminApi } from "../../../helper/axios/adminAxios";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

const override = css`
  display: block;
  margin: 0 auto;
`;

function DrApplications() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([{}]);
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#36d7b7");
  useEffect(() => {
    adminApi.get("/doctors").then((response) => {
      if (response.data.status) {
        console.log(response.data.doctors);
        setDoctors([...response.data.doctors]);
        setLoading(false);
      }
    });
  }, []);
  return (
    <div className="p-4 mt-10">
      {loading ? (
        <div className="w-full h-full flex justify-center items-center">
          <ClipLoader
            css={override}
            size={150}
            color={"#36d7b7"}
            loading={loading}
          />
        </div>
      ) : (
        <div className="relative overflow-x-auto ">
          {doctors?.length ? (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-xl ">
              <thead className="text-xs text-gray-700 uppercase bg-[#05445E] dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    SI No
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Doctor
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Counsil
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Register Number
                  </th>
                  <th scope="col" className="px-6 py-3 ">
                    view
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr className="bg-white border-b bg-[#a0d6db] dark:border-gray-700 ">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{`${doctor?.firstName} ${doctor?.lastName}`}</td>
                        <td className="px-6 py-4">{doctor?.councilName}</td>
                        <td className="px-6 py-4">{doctor?.registerNumber}</td>
                        <td
                          className="px-6 py-4 cursor-pointer underline underline-offset-2 "
                          onClick={() =>
                            navigate(`/admin/dr_approval/${doctor?._id}`)
                          }
                        >
                          <p className="hover:shadow-lg hover:shadow-green-400  hover:bg-green-300 hover:text-white p-2 hover:rounded-lg w-fit text-center">More</p>
                          
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="w-full h-full flex justify-center">
              <p>Currently No applications found...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DrApplications;
