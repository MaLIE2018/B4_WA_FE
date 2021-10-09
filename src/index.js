import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import GlobalState from "../src/components/GlobalState";
import { socket, SocketContext } from "./socket";
import App from "./App";

ReactDOM.render(
  <SocketContext.Provider value={socket}>
    <GlobalState>
      <App />
    </GlobalState>
  </SocketContext.Provider>,
  document.getElementById("root")
);
