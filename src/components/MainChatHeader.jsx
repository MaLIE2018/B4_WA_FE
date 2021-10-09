import React, { useEffect, useState, useContext } from "react";
import { dateDiff } from "../lib/helper";
import { LoginContext } from "./GlobalState";

const MainChatHeader = () => {
  const { isTyping, chatPartner, user, setChatPartner, selectedChatId } =
    useContext(LoginContext);
  const [show, setShow] = useState(false);
  const [selectedChat, setSelectedChat] = useState({});
  const [firstRun, setFirstRun] = useState(true);
  const toggleFriend = () => {
    const mainComp = document.getElementById("friend");
    mainComp.style.width = show ? "40%" : "0%";
  };
  useEffect(() => {
    if (user.chats && user.chats.length > 0) {
      const selectedChat = user.chats.find((c) => c._id === selectedChatId);
      if (selectedChat) {
        setChatPartner({
          name: selectedChat.participants.find((el) => {
            return el.profile.email !== user.profile.email;
          }).profile.firstName,
          avatar: selectedChat.participants.find((el) => {
            return el.profile.email !== user.profile.email;
          }).profile.avatar,
          online: selectedChat.participants.find((el) => {
            return el.profile.email !== user.profile.email;
          }).profile.online,
          lastSeen: selectedChat.participants.find((el) => {
            return el.profile.email !== user.profile.email;
          }).profile.lastSeen,
        });
      }
    }
  }, [user, selectedChatId]);

  useEffect(() => {
    if (user?.chats) {
      setSelectedChat(user.chats.find((c) => c._id === selectedChatId));
    }
  }, [user]);

  if (selectedChat && selectedChat.participants !== undefined) {
    if (selectedChat.participants.length === 2) {
      return (
        <header className='chat-header'>
          <div className='d-flex justify-content-center align-items-center'>
            <img
              src={
                chatPartner && chatPartner.avatar
                  ? chatPartner.avatar
                  : "https://image.flaticon.com/icons/png/512/4333/4333609.png"
              }
              alt='avatar'
              className='avatar-img-style'
              onClick={() => {
                setShow(!show);
                toggleFriend();
              }}
            />
            <div
              className='d-flex flex-column ms-2'
              style={{ marginTop: "10px" }}>
              <span>{chatPartner.name}</span>
              <span className='under-chat-partner'>
                {isTyping
                  ? "...is typing"
                  : chatPartner.online
                  ? "online"
                  : chatPartner?.lastSeen
                  ? "last seen " + dateDiff(chatPartner.lastSeen, Date.now())
                  : "last seen 01.01.01"}
              </span>
            </div>
          </div>
        </header>
      );
    } else {
      return (
        <header className='chat-header'>
          <div className='d-flex justify-content-center align-items-center'>
            <img
              src='https://image.flaticon.com/icons/png/512/4333/4333609.png'
              alt='avatar'
              className='avatar-img-style'
              // onClick={() => {
              //   setShow(!show);
              //   toggleFriend();
              // }}
            />
            <div
              className='d-flex flex-column ms-2'
              style={{ marginTop: "10px" }}>
              <span>{selectedChat.name ? selectedChat.name : "Group"}</span>
              <span className='under-chat-partner'>
                {selectedChat.participants
                  .filter((i) => i.profile.email !== user.profile.email)
                  .map((single) => single.profile.firstName)
                  .join(", ") + ", you"}
              </span>
            </div>
          </div>
        </header>
      );
    }
  } else {
    return null;
  }
};

export default MainChatHeader;
