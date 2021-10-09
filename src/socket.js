import { io } from "socket.io-client";
import { createContext } from "react";

export const SocketContext = createContext();
const address = process.env.REACT_APP_BE_URL;

export const socket = io(address, {
  transports: ["websocket"],
});
