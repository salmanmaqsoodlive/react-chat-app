import { w3cwebsocket as W3CWebSocket } from "websocket";

class WebSocketService {
  constructor(token, receiverId) {
    const websocketURL = `ws://127.0.0.1:8000/ws/sc/?token=${encodeURIComponent(
      token
    )}&receiver_id=${receiverId}`;
    this.socket = new W3CWebSocket(websocketURL);
    this.socket.onopen = () => {
      console.log("WebSocket connection opened!");
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  sendChatMessage = (message) => {
    this.socket.send(JSON.stringify({ type: "chat", message }));
  };

  sendVoiceNote = (voiceNoteData) => {
    this.socket.send(JSON.stringify({ type: "voice_note", voiceNoteData }));
  };

  setOnMessageHandler = (handler) => {
    console.log("runnin ggg");
    this.socket.onmessage = handler;
  };

  closeConnection = () => {
    this.socket.close();
  };
}

export default WebSocketService;
