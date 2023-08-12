import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/client/navbar/Navbar";
import UserNotifications from "../../components/client/UserNotifications/UserNotifications";
import Footer from '../../components/client/Footer/Footer'

function UserNotificationPage() {
  const { id, notifications } = useSelector((store) => store.user);
  const [usernotifications, setNotifications] = useState([]);
  useEffect(() => {
    if (id) {
      setNotifications([...notifications]);
    }
  }, [id, notifications]);
  return (
    <div>
      <div className="h-[10vh]">
        <Navbar />
      </div>
      <div className="w-full h-[90vh] ">
        <UserNotifications usernotifications={usernotifications} />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}

export default UserNotificationPage;
