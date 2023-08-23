import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/client/navbar/Navbar";
import UserNotifications from "../../components/client/UserNotifications/UserNotifications";
import Footer from '../../components/client/Footer/Footer'

function UserNotificationPage() {
  const { id, notifications } = useSelector((store) => store.user);
  const [usernotifications, setNotifications] = useState([]);
  const [deleteNotification,setDeleteNotification] = useState(false)
  useEffect(() => {
    if (id) {
      setNotifications([...notifications]);
    }
  }, [id, notifications,deleteNotification]);
  return (
    <div>
      <div className="h-[10vh]">
        <Navbar />
      </div>
      <div className="w-full h-[90vh] ">
        <UserNotifications usernotifications={usernotifications} setDeleteNotification={setDeleteNotification} />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default UserNotificationPage;
