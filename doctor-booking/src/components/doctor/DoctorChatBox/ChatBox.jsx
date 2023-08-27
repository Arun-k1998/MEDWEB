import React, { useEffect, useRef, useState } from "react";
import api from "../../../helper/axios/userAxios";
import profileIcon from "../../../assets/ChatProfile/chatProfile.jpg";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { doctorApi } from "../../../helper/axios/doctorAxios";
import "./ChatBox.css";

function ChatBox({ chat, currentUserId, setSendMessage, recieveMessage,online }) {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    if (recieveMessage !== null && recieveMessage?.chatId === chat?._id) {
      setMessages([...messages, recieveMessage]);
    }
  }, [recieveMessage]);

  useEffect(() => {
    const getUser = async () => {
      const userId = chat.members.find((member) => member !== currentUserId);
      try {
        doctorApi.get(`/chat/user/${userId}`).then((res) => {
          const { data } = res;
          setUserData(data);
        });
      } catch (error) {}
    };
    if (chat !== null) getUser();
  }, [chat, currentUserId]);

  const handleNewMessages = (message) => {
    setNewMessage(message);
  };
  useEffect(() => {
    const fetchMessages = async () => {
      doctorApi.get(`/message/${chat._id}`).then((res) => {
        const { data } = res;
        console.log(data, "messager");
        setMessages(data);
      });
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  const timeFormate = (time) => {
    const formatedTime = moment(time).startOf("hour").fromNow();
    return formatedTime;
  };

  const handleSend = (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUserId,
      chatId: chat._id,
      text: newMessage,
    };

    doctorApi
      .post("/message", message)
      .then((res) => {
        const { data } = res;
        setMessages([...messages, data]);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
    const receiverId = chat.members.find((user) => user !== currentUserId);
    setSendMessage({ ...message, receiverId });
  };

  // to scroll into latest message
  useEffect(() => {
    scroll?.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      {chat ? (
        <>
          <header className="w-[99%] h-[6rem] bg-white shadow-xl rounded-3xl flex items-center p-3 mt-1">
            <div className="w-20 h-20 rounded-full overflow-hidden">
              <img
                src={
                  userData?.image
                    ? `${serverUrl}images/${userData?.image}`
                    : profileIcon
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 items-center ml-3">
              <div className="flex gap-3">
                <p>{userData?.firstName}</p>
                <p>{userData?.lastName}</p>
              </div>
              <div className="flex items-center gap-3">
                {online ? (
                  <>
                    <div className="w-4 h-4 rounded-full bg-green-400 "></div>
                    <p>Online</p>
                  </>
                ) : (
                  <p>Offline</p>
                )}
              </div>
            </div>
          </header>

          <div className="w-full h-[25rem] px-10 py-5 overflow-y-scroll chatBox ">
            {messages?.map((message, index) => {
              return (
                <div
                  key={index}
                  ref={scroll}
                  className={`${
                    message.senderId === currentUserId
                      ? " justify-end "
                      : "justify-start"
                  } w-full flex my-2 `}
                >
                  <div
                    className={`${
                      message.senderId === currentUserId
                        ? "bg-teal-700 text-whtie"
                        : "bg-cyan-500 text-white"
                    }min-w-[10rem]  text-white p-3 rounded-lg`}
                  >
                    <p className="text-lg font-sans">{message?.text}</p>
                    <span className="text-xs">
                      {timeFormate(message?.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full my-2 flex items-center justify-center gap-3">
            <div className="w-3/4">
              <InputEmoji
                value={newMessage}
                onChange={handleNewMessages}
                placeholder="Type a message"
              />
            </div>

            <button
              className="w-28 h-10 rounded-lg bg-fuchsia-400 text-white p-1"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </>
      ) : (
        <span>Tap on chat</span>
      )}
    </div>
  );
}

export default ChatBox;
