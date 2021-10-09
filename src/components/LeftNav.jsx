import "./styles/LeftNav.css";
import { Col, FormControl, Form } from "react-bootstrap";
import { AiOutlineSearch } from "react-icons/ai";
import { useState, useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiMessageDetail, BiLoaderCircle } from "react-icons/bi";

import ChatItem from "./ChatItem";
import Users from "./Users";
import { getRequest, postRequest } from "../lib/axios";
import { LoginContext } from "./GlobalState";
import { SocketContext } from "../socket";
import { withRouter } from "react-router-dom";

const LeftNav = ({ profile, chats, friends, history }) => {
  const toggleContacts = () => {
    const mainComp = document.getElementById("mainComp");
    mainComp.style.width = "100%";
  };
  const toggleProfile = () => {
    const mainComp = document.getElementById("myProfile");
    mainComp.style.width = "100%";
  };
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(null);
  const [check, setCheck] = useState(false);
  const [chat, setChat] = useState(null);
  const {
    setUser,
    setLoggedIn,
    setMessages,
    setChatPartner,
    setAllUsers,
    setSelectedChatId,
    user,
  } = useContext(LoginContext);
  const socket = useContext(SocketContext);

  const handleSearchInput = (event) => {
    const query = event.target.value;
    setQuery(query);
  };

  const getChats = async () => {
    try {
      const request = await getRequest("chat/me");
      if (request.status === 200) {
        setUser((u) => {
          return { ...u, chats: request.data };
        });
        socket.emit("connect-chats", user._id, request.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser({});
        setMessages([]);
        setChatPartner({});
        setAllUsers([]);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  const makeQuery = async (event) => {
    try {
      const endPoint = check ? `users/me/friends/` : `users/finduser/`;

      event.preventDefault();
      if (query && query.length > 1) {
        const request = await getRequest(endPoint + query);
        if (request.status === 200) {
          setUsers(request.data);
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        setUser({});
        setMessages([]);
        setChatPartner({});
        setAllUsers([]);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  const makeChat = async (participantId) => {
    const chatObject = {
      participants: [participantId],
    };
    try {
      const request = await postRequest("chat", chatObject);
      if (request.status === 200) {
        setChat(request.data);
        setSelectedChatId(request.data._id);
        getChats();
        socket.emit(
          "participants-Join-room",
          request.data._id,
          request.data.participants
        );
        setUsers(null);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        setUser({});
        setMessages([]);
        setChatPartner({});
        setAllUsers([]);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  const handleCheckBox = (event) => {
    setCheck(!check);
  };

  return (
    <>
      <div className='profile-part-main'>
        <img
          src={profile ? profile.avatar : "avatar"}
          alt='avatar'
          className='avatar-img-style'
          onClick={() => toggleProfile()}
        />
        <span className='profile-user-header'>
          {profile && profile.firstName}
        </span>
        <div className='icons-span'>
          <span className='icons-wrapper mx-3'>
            <BiLoaderCircle className='icons-profile-style' />
          </span>
          <span className='icons-wrapper mx-3'>
            <BsThreeDotsVertical className='icons-profile-style' />
          </span>
          <span className='icons-wrapper mx-3 me-4'>
            <BiMessageDetail
              onClick={() => toggleContacts()}
              className='icons-profile-style'
            />
          </span>
        </div>
      </div>
      <Col md={12} className='position-relative'>
        <Form onSubmit={makeQuery}>
          <div className='searching-div'>
            <span className='magnify-wrapper'>
              <AiOutlineSearch className='magnify-glass-navbar' />
            </span>{" "}
            <FormControl
              onChange={handleSearchInput}
              value={query}
              type='text'
              placeholder={
                check === true ? "Search for contacts" : "Search for users"
              }
              className='navbar-searching-style'
            />
            <input
              type='checkbox'
              style={{ marginLeft: "5px" }}
              onChange={handleCheckBox}
            />
          </div>
        </Form>
      </Col>

      {users !== null && query
        ? users.map((user) => (
            <div>
              <div
                onClick={async () => {
                  await makeChat(user._id);
                  socket.emit(
                    "participants-Join-room",
                    chat?._id,
                    chat?.participants
                  );
                }}>
                <Users key={user._id} user={user} />
              </div>
            </div>
          ))
        : chats?.length > 0
        ? chats.map((item) => {
            return <ChatItem key={item._id} chat={item} />;
          })
        : null}
    </>
  );
};
export default withRouter(LeftNav);
