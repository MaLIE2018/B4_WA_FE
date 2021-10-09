import React, { useState } from "react";

export const LoginContext = React.createContext();

const GlobalState = ({ children }) => {
  const [user, setUser] = useState({});
  const [selectedChatId, setSelectedChatId] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatPartner, setChatPartner] = useState({});
  const [newMessages, setNewMessages] = useState(new Map());
  const [socketId, setSocketId] = useState("");
  const [allUsers, setAllUsers] = useState("");
  const [group, setGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [delivered, setDelivered] = useState(true);
  return (
    <LoginContext.Provider
      value={{
        group,
        setGroup,
        delivered,
        setDelivered,
        allUsers,
        setLoading,
        loading,
        setAllUsers,
        user,
        chatPartner,
        setNewMessages,
        newMessages,
        setChatPartner,
        setUser,
        isTyping,
        setIsTyping,
        selectedChatId,
        setSelectedChatId,
        socketId,
        setSocketId,
        loggedIn,
        setLoggedIn,
        messages,
        setMessages,
      }}>
      {children}
    </LoginContext.Provider>
  );
};
export default GlobalState;
