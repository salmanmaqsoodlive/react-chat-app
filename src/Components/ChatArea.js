// ChatArea.js
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import withAuthentication from "../utils/withAuthentication";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios";
import { ReactMic } from "react-mic";
import { useNavigate, useParams } from "react-router-dom";
import ReactAudioPlayer from "react-audio-player";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Slide,
  Snackbar,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ThumbDownAltRounded, ThumbUpAltRounded } from "@mui/icons-material";

const BASE_URL = "http://ec2-54-237-221-234.compute-1.amazonaws.com:8000";

const ChatArea = () => {
  const params = useParams();
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [parentId, setParentId] = useState(null);
  const webSocketService = new W3CWebSocket(
    `ws://54.237.221.234:8000/ws/sc/?token=${encodeURIComponent(
      token
    )}&receiver_id=${params.id}&parent_id=${parentId}`
  );

  const [visibleIds, setVisibleIds] = useState([]);
  const observedElementsRef = useRef([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [notificationData, setNotificationData] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    fetchChats();
    webSocketService.onopen = () => {
      console.log("WebSocket connection opened!");
    };

    setUser(JSON.parse(localStorage.getItem("currentUser")));
    setToken(getAuthTokenFromCookie());
    webSocketService.onmessage = (event) => {
      fetchChats();
      const receivedData = JSON.parse(event.data);
      const message = receivedData.message;
      const messageType = receivedData.message_type;
      // const data = JSON.parse(event);
      console.log("Message from server", receivedData);
      if (messageType === "like") {
        fetchChats();
        setNotificationData(JSON.parse(receivedData.message));
        setShowSnackbar(true);
      }
      if (messageType === "chat") {
      } else if (messageType === "voice_note") {
        setChats((prevChats) => [
          ...prevChats,
          {
            sender_id: user.id,
            receiver_id: params.id,
            voice_note_data: message,
          },
        ]);
      } else if (messageType === "file") {
        setChats((prevChats) => [
          ...prevChats,
          {
            sender_id: user.id,
            receiver_id: params.id,
            image_data: message,
          },
        ]);
      }

    };

    return () => {
      webSocketService.close();
    };
  }, [params.id, token]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleIds = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target.getAttribute("data-id"));

        setVisibleIds(newVisibleIds);
      },
      { threshold: 0.5 }
    );

    // Clear and observe elements when the component renders
    observedElementsRef.current.forEach((element) => {
      observer.unobserve(element);
    });

    observedElementsRef.current = document.querySelectorAll("[data-id]");

    observedElementsRef.current.forEach((element) => {
      observer.observe(element);
    });

    // Cleanup the observer when component unmounts
    return () => {
      observedElementsRef.current.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  // Update visible IDs on scroll
  useEffect(() => {
    const handleScroll = () => {
      observedElementsRef.current.forEach((element) => {
        const isVisible =
          element.getBoundingClientRect().top < window.outerHeight;
        if (isVisible) {
          const id = element.getAttribute("data-id");
          setVisibleIds((prevVisibleIds) => [
            ...new Set([...prevVisibleIds, id]),
          ]);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    return async () => {
      await markAsRead();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [visibleIds]);

  const handleSendButton = () => {
    if (inputValue) {
      webSocketService.send(
        JSON.stringify({ type: "chat", message: inputValue })
      );
      setInputValue("");
    } else if (recordedBlob && inputValue == "") {
      webSocketService.send(
        JSON.stringify({ type: "voice_note", voiceNoteData: recordedBlob })
      );

      setRecordedBlob(null);
    }

    if (selectedFile) {
      sendFile();
    }
    setParentId(null);
    setSelectedFile(null);
  };

  function TransitionLeft(props) {
    return <Slide {...props} direction="left" />;
  }

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleReplyInputChange = (event, parentId) => {
    setInputValue(event.target.value);
    setParentId(parentId);
  };

  const fetchChats = async () => {
    try {
      const token = getAuthTokenFromCookie();
      setToken(token);
      if (!token) return;
      const response = await axios.get(`${BASE_URL}/chats/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChats(response.data.data);
    } catch (error) {
      // console.error("Error fetching chats:", error);
    }
  };

  const onStartRecording = () => {
    setIsRecording(true);
  };

  const onStopRecording = (recordedBlob) => {
    setIsRecording(false);
    setRecordedBlob(recordedBlob);

    // Ensure that recordedBlob.blob is a Blob
    if (recordedBlob.blob instanceof Blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(",")[1]; // Extract the base64 data
        setRecordedBlob(base64Data);
        console.log(
          "Base64 Data: ",
          JSON.stringify({ type: "voice_note", voiceNoteData: base64Data })
        );
      };

      // Read the blob as Data URL
      reader.readAsDataURL(recordedBlob.blob);
    } else {
      console.error("recordedBlob.blob is not a Blob:", recordedBlob.blob);
    }
  };

  const getAuthTokenFromCookie = () => {
    const cookies = document.cookie.split(";");

    for (const key in cookies) {
      if (Object.hasOwnProperty.call(cookies, key)) {
        const cookie = cookies[key];

        const [name, value] = cookie.trim().split("=");

        if (name === "token") {
          return value;
        }
      }
    }
  };

  const replyButtonClicked = (parentId) => {
    setParentId(parentId);
  };

  const markAsRead = async () => {
    try {
      const token = getAuthTokenFromCookie();
      if (!token) return;
      const response = await axios.post(
        `${BASE_URL}/read-receipt`,
        {
          chat_ids: visibleIds,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("response", response.data);
      fetchChats();
    } catch (error) {
      console.log("Error fetching receits:", error.response.data.detail);
      if (error.response.data.detail === "Invalid token") {
        navigate("/login");
      }
    }
  };

  const sendFile = () => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result.split(",")[1];
      webSocketService.send(
        JSON.stringify({ type: "file", fileData: base64Data })
      );
      setSelectedFile(null);
    };

    reader.readAsDataURL(selectedFile);
  };

  const likeButtonClicked = (chatId, userId, senderId, receiverId) => {
    const payload = {
      chatId,
      userId,
      senderId,
      receiverId,
    };
    webSocketService.send(JSON.stringify({ type: "like", likeData: payload }));
  };

  useEffect(() => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 3000);
  }, [showSnackbar]);
  return (
    <div className="chat-area">
      {showSnackbar && notificationData.userId !== user.id && (
        <Snackbar
          open={showSnackbar}
          TransitionComponent={TransitionLeft}
          message={notificationData.message}
          action={<ThumbUpAltRounded />}
        />
      )}
      <div className="chat-header"></div>
      <div className="messages">
        {chats.length > 0 &&
          chats.map((chat, index) => {
            return (
              <div key={index} data-id={chat.id}>
                {chat?.content && (
                  <Message
                    chatId={chat.id}
                    text={chat?.content}
                    sent={chat.sender_id == user?.id ? true : false}
                    replyButtonClicked={() => replyButtonClicked(chat.id)}
                    isThread={true}
                    isRead={chat.is_read}
                    markAsRead={() => markAsRead(chat.id)}
                    isLiked={chat.is_liked}
                    likeButtonClicked={() =>
                      likeButtonClicked(
                        chat.id,
                        user.id,
                        chat.sender_id,
                        chat.receiver_id
                      )
                    }
                    showElementToSelf={chat.sender_id == user.id}
                  >
                    {chat.replies.length > 0 && (
                      <div
                        className={`my-2 mx-5 d-flex ${
                          chat.sender_id == user?.id
                            ? "justify-content-end"
                            : ""
                        }`}
                      >
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                          >
                            <Typography className="text-primary">
                              replies ({chat.replies.length})
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {chat.replies.length > 0 &&
                              chat.replies.map((reply) => (
                                <Message
                                  text={reply.content}
                                  sent={
                                    reply.sender_id == user?.id ? true : false
                                  }
                                />
                              ))}
                          </AccordionDetails>
                          <MessageInput
                            placeholder="Reply..."
                            onClick={handleSendButton}
                            onChange={(e) => handleReplyInputChange(e, chat.id)}
                            inputValue={inputValue}
                            isThread={true}
                          />
                        </Accordion>
                      </div>
                    )}
                  </Message>
                )}
                {chat.voice_note_data && (
                  <div
                    className={`message ${
                      chat.sender_id == user?.id ? "sent" : "recieved"
                    }`}
                  >
                    <audio controls>
                      <source
                        src={`data:audio/wav;base64,${chat.voice_note_data}`}
                        type="audio/wav"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {chat?.file_field && (
                  <div
                    className={`message ${
                      chat.sender_id === user?.id ? "sent" : "received"
                    }`}
                  >
                    <img
                      src={`http://localhost:8000${chat.file_field}`}
                      alt="Chat Image"
                    />
                  </div>
                )}
              </div>
            );
          })}
        <div ref={bottomRef} />
      </div>
      <MessageInput
        placeholder="Type your message"
        onClick={handleSendButton}
        onChange={handleInputChange}
        handleFileInputChange={handleFileInputChange}
        inputValue={inputValue}
      />
      <div className="voice-recording">
        <ReactMic
          record={isRecording}
          className="sound-wave"
          onStop={onStopRecording}
          onData={(recordedData) =>
            console.log("chunk of real-time data", recordedData)
          }
        />
        <button onClick={isRecording ? onStopRecording : onStartRecording}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
    </div>
  );
};

export default withAuthentication(ChatArea);
