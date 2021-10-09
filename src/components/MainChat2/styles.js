import styled from "styled-components";

export const Styles = styled.div`
  .chat-wrapper {
    position: relative;
    z-index: 100;
    height: calc(100vh - 4rem);
    overflow: hidden;
  }
  .chat-main {
    display: flex;
    flex-direction: column;
    height: 100%;

    .chat-header {
      position: relative;
      z-index: 1000;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      width: 100%;
      height: 59px;
    }
    .chat-main_1LcQk {
      position: relative;
      z-index: 1;
      flex: 1 1 0;
      order: 2;
      .chat-messages-container {
        position: absolute;
        top: 0;
        z-index: 100;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        transition: background 0.3s ease-out 0.1s;
        background-image: url(https://theabbie.github.io/blog/assets/official-whatsapp-background-image.jpg);
        .chat-messages {
          flex: 0 0 auto;
        }
      }
    }
    .chat-footer {
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      flex: none;
      order: 3;
      width: 100%;
      min-height: 62px;
    }
  }
`;
