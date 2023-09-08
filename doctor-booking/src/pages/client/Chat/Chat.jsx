import React, { useEffect, useRef, useState } from "react";
import icon from "../../../assets/logo/medweblogo.png";
import { useSelector } from "react-redux";
import api from "../../../helper/axios/userAxios";
import UserChat from "../../../components/client/UserChat/UserChat";
import ChatBox from "../../../components/client/ChatBox/ChatBox";
import { io } from "socket.io-client";

function Chat() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [recieveMessage,setRecieveMessage] = useState(null)
  const userId = useSelector((store) => store.user.id);
  const socketURL = import.meta.env.VITE_SOCKET_URL
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const socket = useRef();

  useEffect(() => {
    socket.current = io(`${serverUrl}`);
    socket.current.emit("new-user-add", userId);
    socket.current.on("get-users", (users) => setOnlineUsers(users));
    return () => {
      // Clean up and disconnect when the component unmounts
      if (socket) {
        socket.current.emit('disconnected',userId)
        socket.current.on("get-users", (users) => setOnlineUsers(users));
      }
    };
  }, [userId]);

  useEffect(() => {
    const getUser = async () => {
      api.get(`/chat/${userId}`).then((res) => {
        setChats([...res.data]);
      });
    };
    getUser();
  }, [userId]);

  useEffect(()=>{
    if(sendMessage !== null){
        
        socket.current.emit('send-message',sendMessage)
    }
  },[sendMessage])

  useEffect(()=>{
    socket.current.on("receive-message",(data)=>{
       
        setRecieveMessage(data)
    })

  },[])

  //check online status

  const checkOnlineUsers = (chat)=>{
    const chatMember = chat?.members?.find((user)=> user !== userId)
    const online = onlineUsers?.find((user)=> user.userId === chatMember)
    console.log(online,'online');
   
    return online ? true : false
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 w-[100vw] h-[100vh] ">
      <header className="w-[95vw] h-[10vh] rounded-full bg-green-100 p-2 flex items-center justify-around ">
        <div>
          <p className="text-xl">Let's Chat</p>
        </div>
        <div className="w-40 h-full overflow-hidden">
          <img src={icon} alt="" className="w-full h-full " />
        </div>
      </header>
      <div className="w-[95vw] h-[85vh] bg-green-100 rounded-3xl grid grid-cols-[25%_auto] gap-4 p-4 ">
        {/* Left Section */}
        <section className="w-full h-full rounded-3xl flex flex-col ">
          <div className="w-full flex flex-col gap-4 text-center">
            <p>Doctors</p>
            <hr className="h-1 bg-slate-400" />
          </div>
          <div className=" w-full h-full  flex flex-col gap-4 overflow-y-scroll ">
            {chats.map((chat, index) => (
              <div
                className="w-full h-28 flex items-center bg-white p-4 my-4 rounded-lg hover:bg-slate-300 "
                onClick={() => setCurrentChat(chat)}
                key={index}
              >
                <UserChat data={chat} currentUserId={userId} online={checkOnlineUsers(chat)} />
              </div>
            ))}
          </div>
        </section>
        {/* Right Section */}
        <section className="w-full h-full bg-white rounded-3xl flex flex-col ">
          <ChatBox
            chat={currentChat}
            currentUserId={userId}
            setSendMessage={setSendMessage}
            recieveMessage={recieveMessage}
            online={checkOnlineUsers(currentChat)} 
          />
        </section>
      </div>
    </div>
  );
}

export default Chat;
