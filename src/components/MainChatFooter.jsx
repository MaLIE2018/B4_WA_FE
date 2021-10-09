import React, { useContext, useEffect, useRef, useState } from "react";
import { FormControl } from "react-bootstrap";
import { BsFillMicFill } from "react-icons/bs";
import { FiPaperclip } from "react-icons/fi";
import { GrEmoji } from "react-icons/gr";
import { putRequest } from "../lib/axios";
import { gotoBottom } from "../lib/helper";
import { SocketContext } from "../socket";
import { LoginContext } from "./GlobalState";
import Compress from "react-image-file-resizer";
import Picker from "emoji-picker-react";

const MainChatFooter = () => {
  const [emojiClicked, setEmojiClicked] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const imageInput = () => {
    let input = document.getElementById("imageInput");
    input.click();
  };
  const toggleEmoji = () => {
    emojiClicked ? setEmojiClicked(false) : setEmojiClicked(true);
  };
  const {
    selectedChatId,
    user,
    setMessages,
    setLoading,
    setDelivered,
    messages,
  } = useContext(LoginContext);
  const socket = useContext(SocketContext);
  const pickerRef = useRef(null);

  let messageToSend = {
    text: newMessage,
    chatId: selectedChatId,
    userId: user._id,
    date: new Date().toISOString(),
    status: "waiting",
    type: "text",
  };

  const upLoadImage = async (file) => {
    setLoading(true);
    var formdata = new FormData();
    formdata.append("img", file);
    try {
      const res = await putRequest("chat/upload", formdata);
      if (res.status === 200) {
        setLoading(false);

        messageToSend = {
          ...messageToSend,
          type: "photo",
          image: res.data.image,
        };
        handleSubmit();
      }
    } catch (error) {
      setLoading(false);
      alert(error);
      console.log(error);
    }
  };

  // image to uri
  const imageToUri = async () => {
    let input = document.getElementById("imageInput");
    if (input.files[0]) {
      const file = input.files[0];
      const type = file.type.replace("image/", "");
      Compress.imageFileResizer(
        file, // the file from input
        300, // width
        300, // height
        type, // compress format WEBP, JPEG, PNG
        20, // quality
        0, // rotation
        (uri) => {
          upLoadImage(file);
        },
        "base64" // blob or base64 default base64
      );
    }
  };
  useEffect(() => {
    gotoBottom(".chat-messages-container");
  }, [messages]);

  const handleSubmit = () => {
    socket.emit("send-message", messageToSend, selectedChatId);
    setDelivered(false);
    setMessages((h) => [...h, messageToSend]);
    setNewMessage("");
  };
  const onEmojiClick = (event, emojiObject) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };

  return (
    <footer className='chat-footer'>
      <FiPaperclip onClick={() => imageInput()} className='mx-1 paperClip' />
      <div ref={GrEmoji}>
        <GrEmoji onClick={() => toggleEmoji()} className='emoji mx-1' />
      </div>

      <FormControl
        type='text'
        placeholder='Type your message...'
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        className='message-input-main-chat'
        onKeyDown={(e) => {
          socket.emit("im-typing", selectedChatId);
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        onKeyUp={(e) => {
          socket.emit("i-stopped-typing", selectedChatId);
        }}
      />
      <span>
        <BsFillMicFill className='voice-message-icon' />
      </span>
      {emojiClicked && (
        <div ref={pickerRef}>
          <Picker
            pickerStyle={{
              position: "absolute",
              left: 0,
              bottom: "4rem",
            }}
            onEmojiClick={onEmojiClick}
          />
        </div>
      )}

      <input
        style={{ display: "none" }}
        id='imageInput'
        type={"file"}
        onChange={() => imageToUri()}
      />
    </footer>
  );
};

export default MainChatFooter;
