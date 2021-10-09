import { Styles } from "./styles";
import MainChatHeader from "../MainChatHeader";
import MainChatFooter from "../MainChatFooter";
import MainChatMessages from "../MainChatMessages";
import SocketWrapper from "../SocketWrapper";
import "../styles/MainChat.css";
import Friend from "../Friend";

const MainChat2 = () => {
  return (
    <Styles>
      <div className='chat-wrapper'>
        <div className='chat-main'>
          <MainChatHeader />
          <MainChatMessages />
          <MainChatFooter />
          <Friend />
        </div>
      </div>
      <SocketWrapper />
    </Styles>
  );
};

export default MainChat2;
