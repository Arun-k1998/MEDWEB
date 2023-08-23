import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/client/navbar/Navbar";
import api from "../../helper/axios/userAxios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DoctorListingCard from "../../components/client/doctorListingCard/DoctorListingCard";
import SearchBar from "../../components/client/SearchBar/SearchBar";
import UserSidbar from "../../components/client/SideBar/UserSidbar";
import Login from "../admin/Login";
import Footer from "../../components/client/Footer/Footer";
import { ToastifyContest } from "../../helper/contest/ToastifyContest";

function DoctorList() {
  // const { name } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");

  const [docotrsList, setDoctorsList] = useState([]);
  const [search, setSearch] = useState("");
  const [value, setValue] = useState("");
  const [specilization, setSpecilization] = useState([{}]);
  const [pages, setPages] = useState(null);
  const [filter, setFilter] = useState([name ? name : null]);
  const [filterState, setFilterState] = useState(false);
  const { show } = useContext(ToastifyContest);
  const navigate = useNavigate();
  const [pageNos, setPageNos] = useState([]);
  const [pageNo, setPageNo] = useState(null);

  const searchByName = (e) => {
    const search = e.target.value;
    setValue(search);
  };

  const handleCheckBoxChange = (e, index) => {
    const { value, checked } = e.target;

    setSpecilization((prev) => {
      return [
        ...prev.map((specilization, index1) => {
          if (index1 === index) {
            specilization["checked"] = checked;
          }
          return specilization;
        }),
      ];
    });
    setTimeout(() => {
      let array = [];
      specilization?.forEach((obj) => {
        if (obj.checked) array.push(obj._id);
      });
      let stringArray = array?.join(",");

      api
        .get(`/consult?sid=${stringArray}`)
        .then((res) => {
          if (res.data.status) {
            console.log("pageeeeeeeeee", res.data.totalPages);
            let totalPages = res.data.totalPages;
            console.log(totalPages);
            let array = [];
            for (let i = 1; i <= totalPages; i++) {
              if (i === pageNo) array.push({ page: i, active: true });
              else array.push({ page: i, active: false });
            }
            setPageNos([...array]);
            setDoctorsList([...res.data.doctors]);
          }
        })
        .catch((error) => {
          if (error.response) {
            show(error.response.data.message, error.response.status);
          } else if (error.request) {
            navigate("/500");
          } else {
            console.log(error);
          }
        });
    }, 0);
  };

  useEffect(() => {
    if (pageNo) {
      let array = [];
      specilization?.forEach((obj) => {
        if (obj.checked) array.push(obj._id);
      });
      let stringArray = array?.join(",");
      api
        .get(`/consult?page=${pageNo}&sid=${stringArray}&search=${value}`)
        .then((res) => {
          if (res.data.status) {
            setDoctorsList([...res.data.doctors]);
          }
        });
    }
  }, [pageNo]);

  useEffect(() => {
    if (value) {
      api
        .get(`/consult?search=${value}`)
        .then((response) => {
          if (response.data.status) {
            console.log(response.data.doctors);
            setDoctorsList([...response.data.doctors]);
          } else {
            setDoctorsList([]);
          }
        })
        .catch((error) => {
          if (error.response) {
            show(error.response.data.message, error.response.status);
          } else if (error.request) {
            navigate("/500");
          } else {
            console.log(error);
          }
        });
    }
  }, [value]);

  // useEffect(()=>{
  //   let stringArray = filter.join(',') ?filter : name
  //   console.log(filter,'filterrrrrrrrrrrrrrrrr');
  //   api.get(`/consult?sid=${stringArray}`).then((res)=>{
  //     if(res.data.status){
  //       console.log(res.data.doctors,'doofoofofd');
  //       setDoctorsList([...res.data.doctors]);
  //     }
  //   })
  // },[filterState])

  useEffect(() => {
    if (!value) {
      let stringArray = filter?.join(",") ? filter : name;

      console.log(stringArray, "string");
      api
        .get(`/consult?sid=${stringArray}`)
        .then((response) => {
          if (response.data.status) {
            let totalPages = response.data.totalPages;
            let array = [];
            for (let i = 1; i <= totalPages; i++) {
              if (i === 1) array.push({ page: i, active: true });
              else array.push({ page: i, active: false });
            }
            setPageNos([...array]);
            setDoctorsList([...response.data.doctors]);
            console.log(response.data.doctors, "doco");
            // console.log(response.data.specilizations);
            console.log(filter, "filter");
            let updatedSpecilization = response.data.specilizations.map(
              (specilizaion) => {
                if (
                  specilizaion._id === name ||
                  filter.includes(specilizaion._id)
                ) {
                  specilizaion["checked"] = true;
                }
                return specilizaion;
              }
            );
            setSpecilization([...updatedSpecilization]);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log("error.response.statusText", error.response.statusText);
            show(
              error.response.data.message || error.response.statusText,
              error.response.status
            );
          } else if (error.request) {
            navigate("/500");
          } else {
            console.log(error.status);
            console.log(error.response);
          }

          console.log(error.config);
        });
    }
  }, [name]);
  // console.log(specilization,'spc');

  return (
    <div>
      <div className="h-[10vh] bg-black">
        <Navbar />
      </div>

      <div className="w-full border-b-2 border-b-[#189AB4] h-[10vh] flex justify-center items-center">
        {/* <SearchBar value={value} search={searchByName} /> */}
        <h1 className="text-xl">Cosnsult With Our specialist</h1>
      </div>

      <div className="grid grid-rows-[2fr_8fr ] md:grid-cols-[1fr_7.5fr] md:h-[80vh] border-b-2 border-b-[#189AB4]">
        <div className=" h-full w-full md:w-[20vw] md:block border-r-2 border-r-[#189AB4] ">
          <SearchBar
            value={value}
            search={searchByName}
            specilizations={specilization}
            handleCheckBoxChange={handleCheckBoxChange}
          />
        </div>
        <DoctorListingCard
          doctors={docotrsList}
          pageNos={pageNos}
          setPageNo={setPageNo}
          setPageNos={setPageNos}
          pageNo={pageNo}
        />
      </div>
      <div className="w-full bg-[#98ced8] h-10 flex justify-center items-center py-2 mt-10">
        <p>Consult with our Doctors</p>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default DoctorList;
