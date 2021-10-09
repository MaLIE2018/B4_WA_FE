import "./styles/LeftNav.css";
import { Row, Col, Button, Dropdown } from "react-bootstrap";
import parseISO from "date-fns/parseISO";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "./GlobalState";
import { format } from "date-fns";
import styled from "styled-components";
import { FaChevronDown } from "react-icons/fa";
import { deleteRequest, getRequest } from "../lib/axios";
import { withRouter } from "react-router-dom";
import { SocketContext } from "../socket";
const Styles = styled.div`
  .menu-button {
    opacity: 0;
    transition: opacity 0.1s ease-in-out;
    border: none;
    background-color: none;
    z-index: 1060;
  }
  .btn-primary {
    background-color: transparent;
  }
  .dropdown-toggle::after {
    border: none;
  }
  .chat-list-item :hover .menu-button {
    opacity: 1;
  }
`;

const ChatItem = ({ chat, history }) => {
  const {
    setSelectedChatId,
    setChatPartner,
    user,
    newMessages,
    selectedChatId,
    setNewMessages,
    setUser,
    setMessages,
    setAllUsers,
    setLoggedIn,
  } = useContext(LoginContext);

  const [showDrop, setShowDrop] = useState(false);
  const { _id, participants, latestMessage, owner, name } = chat;
  const socket = useContext(SocketContext);

  const getChats = async () => {
    try {
      const request = await getRequest("chat/me");
      if (request.status === 200) {
        setUser((u) => {
          return { ...u, chats: request.data };
        });
      }
      if (request.status === 401) {
        history.push("/");
      }
    } catch (error) {
      console.log();
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

  const deleteChat = async () => {
    try {
      const res = await deleteRequest("chat/" + _id);
      if (res.status === 204) {
        socket.emit("room-deleted", _id);
        getChats();
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

  return (
    <Styles>
      <div
        className='chat-list-item'
        style={{
          backgroundColor: `${selectedChatId === _id ? "#EBEBEB" : "#fff"}`,
        }}>
        <Row className='chatRow'>
          <Col
            sm={2}
            className=''
            onClick={() => {
              setSelectedChatId(_id);
              newMessages.delete(_id);
              setNewMessages(new Map(newMessages));
            }}>
            <span>
              <img
                src={
                  participants &&
                  participants.filter((el) => el.profile.socketId !== owner)[0]
                    .profile.avatar
                }
                alt='avatar'
                className='list-avatar-wrapper'
              />{" "}
            </span>
          </Col>
          <Col
            sm={8}
            onClick={() => {
              setSelectedChatId(_id);
              newMessages.delete(_id);
              setNewMessages(new Map(newMessages));
            }}>
            {name ? (
              <div className='chat-item-contact'>{name}</div>
            ) : (
              <div className='chat-item-contact'>
                {participants && participants.length > 2
                  ? participants
                      .filter((i) => i.profile.email !== user.profile.email)
                      .map((single) => single.profile.firstName)
                      .join(", ") + ", you"
                  : participants
                      .filter((i) => i.profile.email !== user.profile.email)
                      .map((single) => single.profile.firstName)}
              </div>
            )}
            <div className='chat-item-message'>
              <span className={latestMessage ? "" : "no-message-chat-item"}>
                {newMessages.has(_id)
                  ? newMessages.get(_id).text
                  : latestMessage?.text
                  ? latestMessage.text
                  : "no messages"}
              </span>
            </div>
          </Col>
          <Col sm={2}>
            <div className='chat-item-time'>
              {latestMessage.date
                ? format(parseISO(latestMessage.date), "hh:mm")
                : "nothing"}
            </div>
            {newMessages.has(_id) && (
              <div
                className=' text-white d-flex justify-content-center align-items-center'
                style={{
                  width: "15px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#06D755",
                }}>
                <span>{newMessages.get(_id).cnt}</span>
              </div>
            )}
            <Dropdown>
              <Dropdown.Toggle className='menu-button btn-link'>
                <FaChevronDown />
              </Dropdown.Toggle>
              <Dropdown.Menu show={showDrop}>
                <Dropdown.Item as={Button} onClick={() => deleteChat()}>
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>
    </Styles>
  );
};

export default withRouter(ChatItem);
