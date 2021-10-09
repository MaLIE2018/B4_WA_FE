import { useContext, useCallback, useEffect } from "react";
import { SocketContext } from "../socket";
import { LoginContext } from "./GlobalState";
import { getRequest } from "../lib/axios";

const SocketWrapper = () => {
  const {
    selectedChatId,
    setMessages,
    setIsTyping,
    setChatPartner,
    setNewMessages,
    newMessages,
    setLoggedIn,
    setUser,
    user,
  } = useContext(LoginContext);

  const socket = useContext(SocketContext);

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
      console.log();
      if (error.response?.status === 401) {
        // socket.emit("offline", user._id);
        setLoggedIn(false);
      } else {
        setLoggedIn(true);
      }
    }
  };

  const handleReceivedMessage = useCallback(
    (message) => {
      console.log("message:", message);
      if (message.chatId !== selectedChatId) {
        setNewMessages(
          new Map(
            newMessages.set(
              `${message.chatId}`,
              newMessages.get(message.chatId)
                ? {
                    cnt: parseInt(newMessages.get(message.chatId).cnt) + 1,
                    text: message.text,
                  }
                : { cnt: `1`, text: message.text }
            )
          )
        );
        console.log(newMessages);
      } else {
        setMessages((h) => [...h, message]);
      }
    },
    [selectedChatId]
  );

  const handleIsTyping = useCallback(
    (chatId) => {
      if (chatId === selectedChatId) {
        setIsTyping(true);
      }
    },
    [selectedChatId]
  );
  const handleMessageDelivered = useCallback(
    (date, chatId) => {
      if (chatId === selectedChatId) {
        setMessages((h) =>
          h.map((message) => {
            if (message.date === date) {
              message = { ...message, status: "received" };
            }
            return message;
          })
        );
      }
    },
    [selectedChatId]
  );
  const handledStopTyping = useCallback(
    (chatId) => {
      if (chatId === selectedChatId) {
        setIsTyping(false);
      }
    },
    [selectedChatId, setIsTyping]
  );
  const handleLogout = useCallback(
    (chatId) => {
      if (chatId !== selectedChatId) {
        setChatPartner((cp) => {
          return { ...cp, online: false, lastSeen: new Date().toISOString() };
        });
      }
    },
    [selectedChatId]
  );

  const handleLogin = useCallback(
    (chatId) => {
      if (chatId === selectedChatId) {
        setChatPartner((cp) => {
          return { ...cp, online: true };
        });
      }
    },
    [selectedChatId]
  );
  const handleNewChat = useCallback(
    (chatId) => {
      getChats();
    },
    [selectedChatId]
  );

  const handleDeleteMessage = useCallback(
    (msgId, chatId) => {
      if (chatId === selectedChatId) {
        setMessages((h) => h.filter((msg) => msg._id !== msgId));
      }
    },
    [selectedChatId]
  );
  const handleConnect = useCallback(() => {
    setUser((u) => {
      return { ...u, profile: { ...u.profile, socketId: socket.id } };
    });
  }, []);

  const handleRoomDeletion = useCallback(
    (chatId) => {
      console.log("room deletion");
      getChats();
    },
    [selectedChatId]
  );

  useEffect(() => {
    socket.on("logged-out", handleLogout);
    socket.on("logged-in", handleLogin);
    socket.on("connect", handleConnect);
    socket.on("deleted-chat", handleRoomDeletion);
    socket.on("receive-message", handleReceivedMessage);
  }, []);

  useEffect(() => {
    socket.on("message-delivered", handleMessageDelivered);
    socket.on("message-deleted", handleDeleteMessage);
    socket.on("stopped-typing", handledStopTyping);
    socket.on("is-typing", handleIsTyping);
    socket.on("new-chat", handleNewChat);
  }, [selectedChatId]);

  return <div className='chat-wrapper'></div>;
};

export default SocketWrapper;
