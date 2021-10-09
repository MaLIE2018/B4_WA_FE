import "./styles/Contacts.css";
import { HiArrowNarrowLeft } from "react-icons/hi";
import { AiOutlineSearch, AiOutlineUsergroupAdd } from "react-icons/ai";
import { FormControl, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useCallback, useEffect, useContext, useState } from "react";
import { getRequest, postRequest } from "../lib/axios";
import { LoginContext } from "./GlobalState";
import { SocketContext } from "../socket";
import { TiDeleteOutline } from "react-icons/ti";
import ContactItem from "./ContactItem";
const Contacts = ({ friends, history }) => {
  const {
    allUsers,
    setAllUsers,
    group,
    setUser,
    setLoggedIn,
    setMessages,
    setChatPartner,
    setGroup,
    user,
  } = useContext(LoginContext);
  const socket = useContext(SocketContext);
  const [setUsers] = useState(null);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAllUsers = useCallback(async () => {
    try {
      const res = await getRequest("users/all");
      if (res.status === 200) {
        setAllUsers(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  const unToggleContacts = () => {
    const mainComp = document.getElementById("mainComp");
    mainComp.style.width = "0px";
  };
  const getChats = async () => {
    try {
      const request = await getRequest("chat/me");
      if (request.status === 200) {
        setUser((u) => {
          return { ...u, chats: request.data };
        });
        unToggleContacts();
        socket.emit("connect-chats", user._id, request.data);
        setGroup([]);
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
  const makeGroupChat = async () => {
    setIsLoading(true);
    const groupObject = {
      name: groupName,
      participants: group,
    };
    try {
      const request = await postRequest("chat", groupObject);
      if (request.status === 200) {
        getChats();
        socket.emit(
          "participants-Join-room",
          request.data._id,
          request.data.participants
        );
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        setUser({});
        setMessages([]);
        setChatPartner({});
        setAllUsers({});
        setLoggedIn(false);
        setIsLoading(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  return (
    <>
      <div id='mainComp' className='contacts-left-nav'>
        <div className='navigation-new-chat'>
          <span>
            <HiArrowNarrowLeft
              onClick={() => unToggleContacts()}
              className='narrow-header'
            />
          </span>
          <span className='navigation-header'> New Chat</span>
        </div>

        <div className='searching-div'>
          <span className='magnify-wrapper'>
            <AiOutlineSearch className='magnify-glass-navbar' />
          </span>{" "}
          <FormControl
            type='text'
            placeholder='Search contacts'
            className='navbar-searching-style'
          />
        </div>
        <Row className='d-flex align-content-center'>
          <Col md={4}>
            <div className='ms-3 mt-4 addGroupButton'>
              <span
                as={Button}
                className='group-icon'
                disabled={group.length !== 0 && !isLoading ? false : true}
                onClick={() => makeGroupChat()}>
                <AiOutlineUsergroupAdd className='group-icon-style' />
              </span>
            </div>
          </Col>
          <Col md={8} className='d-flex align-content-center'>
            <FormControl
              type='text'
              placeholder='Name of the group'
              className='mt-3 me-4'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className='contacts-div-text'>MY CONTACTS</div>
          </Col>
          <div className='ms-3 mb-1'>
            {group.length > 0 &&
              group.map((id) => (
                <Button variant='secondary' className='rounded-pill'>
                  <span className='me-1'>
                    {allUsers.find((el) => el._id === id).profile.firstName}
                  </span>
                  <Button
                    variant='light'
                    className='rounded-circle'
                    onClick={() => setGroup(group.filter((_id) => _id !== id))}>
                    <TiDeleteOutline size={30} />
                  </Button>
                </Button>
              ))}
          </div>
        </Row>
        <Row>
          <ListGroup>
            {allUsers &&
              allUsers.map((item) => (
                <ContactItem item={item} key={item._id} />
              ))}
          </ListGroup>
        </Row>
      </div>
    </>
  );
};

export default Contacts;
