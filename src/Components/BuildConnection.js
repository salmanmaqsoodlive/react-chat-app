import React from "react";
import ChatArea from "./ChatArea";
import { w3cwebsocket as W3CWebSocket } from "websocket";


const BuildConnection = () => {
  const client = new W3CWebSocket("ws://127.0.0.1:8000/ws/sc/");
  useEffect(() => {
    console.log("Running");
    client.onopen = () => {
      console.log("WebSocket Client Connected");
      client.send("Hi, message from clinet");
    };
    client.onmessage = (event) => {
      console.log("Message from server", event.data);
    };
    client.onerror = (event) => {
      console.log("Error");
    };

    client.onclose = (event) => {
      console.log("Close");
    };
  }, []);
  return (
    <div>
      <ChatArea />
    </div>
  );
};

export default BuildConnection;
