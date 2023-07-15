import React from "react";
import Navbar from "../../components/client/navbar/Navbar";
import Sidebar from "../../components/admin/sideBar/Sidebar";
import Banner from "../../components/admin/Banner/Banner";
import AdminNavbar from "../../components/admin/navbar/AdminNavbar";

function Bannerpage() {
  return (
    <div>
      <AdminNavbar />
      <div className="grid grid-cols-[1fr_7fr] sm:grid-cols-[1.5fr_8.5fr] w-full">
        <Sidebar />
        <Banner />
      </div>
    </div>
  );
}

export default Bannerpage;
