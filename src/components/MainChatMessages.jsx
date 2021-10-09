import React, {
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Spinner } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { getRequest } from "../lib/axios";
import { LoginContext } from "./GlobalState";
import { MessageBox } from "react-chat-elements";
import { parseISO } from "date-fns";
import { SocketContext } from "../socket";
import "react-chat-elements/dist/main.css";

const MainChatMessages = ({ history }) => {
  const {
    selectedChatId,
    user,
    messages,
    setMessages,
    setLoggedIn,
    setLoading,
    loading,
    setUser,
    setChatPartner,
    setAllUsers,
  } = useContext(LoginContext);
  const socket = useContext(SocketContext);
  const grEmoji = useRef(null);
  const pickerRef = useRef(null);
  const [emojiClicked, setEmojiClicked] = useState(false);
  const getChatDetails = useCallback(async () => {
    if (selectedChatId) {
      try {
        setLoading(true);
        const res = await getRequest(`chat/${selectedChatId}`);
        if (res.status === 200) {
          setLoading(false);
          setMessages(res.data.history);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          history.push("/");
        }
        setLoading(false);
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
    }
  }, [selectedChatId, setLoggedIn, setMessages]);

  useEffect(() => {
    getChatDetails();
  }, [selectedChatId]);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Close emoji if clicked outside
       */
      function handleClickOutside(event) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          !grEmoji.current.contains(event.target)
        ) {
          setEmojiClicked(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(pickerRef);

  return (
    <div className='chat-main_1LcQk'>
      <main className='chat-messages-container'>
        {loading && (
          <Spinner
            as='span'
            animation='border'
            size='lg'
            role='status'
            aria-hidden='true'
            // className="mx-auto"
            // variant="success"
            style={{
              position: "absolute",
              top: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "rgb(30,190,165)",
            }}
          />
        )}
        <div className='chat-messages'>
          {messages &&
            messages.map((message, i) => (
              <MessageBox
                key={message?._id ?? i}
                position={user._id === message.userId ? "right" : "left"}
                date={message.date ? parseISO(message.date) : "nothing"}
                text={message.text}
                type={message.type}
                removeButton={true}
                onRemoveMessageClick={() => {
                  if (message._id === undefined) {
                    if (message.chatId === selectedChatId) {
                      setMessages((h) =>
                        h.filter((msg) => msg.date !== message.date)
                      );
                    }
                  } else {
                    socket.emit("delete-message", message._id, message.chatId);
                  }
                }}
                data={
                  message?.image && {
                    uri: message.image,
                    status: {
                      click: true,
                      loading: 0,
                    },
                  }
                }
                status={
                  user._id === message.userId
                    ? message.status === "received"
                      ? "received"
                      : "waiting"
                    : "none"
                }
              />
            ))}
        </div>
      </main>
    </div>
  );
};

export default withRouter(MainChatMessages);
