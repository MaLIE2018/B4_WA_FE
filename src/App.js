import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import BackGround from "./components/BackGround";
import Home from "./components/Home.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import LoginPage from "./components/LoginPage";
import { LoginContext } from "../src/components/GlobalState";
import { getRequest } from "./lib/axios";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "./socket";

function App() {
  const {
    loggedIn,
    setLoggedIn,
    setUser,
    setSelectedChatId,
    setChatPartner,
    setMessages,
    setAllUsers,
    newMessages,
  } = useContext(LoginContext);
  const socket = useContext(SocketContext);
  const [firstRun, setFirstRun] = useState(true);

  const isLogged = async () => {
    try {
      const data = await getRequest(`users/me`);
      if (data.status === 200) {
        setLoggedIn(true);
        setUser(data.data);
        if (data.data?.chats[0] && data.data.chats[0]._id)
          setSelectedChatId(data.data.chats[0]._id);
        socket.emit("connect-chats", data.data._id, data.data.chats);
        socket.emit("give-me-my-socket-id", data.data._id);
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

  useEffect(() => {
    isLogged();

    // return socket.emit('offline', user._id);
  }, [loggedIn]);

  useEffect(() => {
    if (newMessages.size > 0) document.title = `(${newMessages.size}) WhatsApp`;
    else document.title = `WhatsApp`;
  }, [newMessages]);

  return (
    <Router>
      {!loggedIn && <Redirect to='/' />}
      {loggedIn && <Redirect to='/home' />}
      <BackGround />
      <Route component={LoginPage} path='/' exact />
      <Route exact path='/home'>
        {!loggedIn ? <Redirect to='/' /> : <Home />}
      </Route>
    </Router>
  );
}

export default App;
