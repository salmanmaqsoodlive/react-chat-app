import {
  CheckCircle,
  ThumbUpAltOutlined,
  ThumbUpOffAltRounded,
} from "@mui/icons-material";
import React, { Children } from "react";

const Message = ({
  children,
  text,
  sent,
  replyButtonClicked,
  isThread,
  isRead,
  markAsRead,
  chatId,
  likeButtonClicked,
  isLiked,
  showElementToSelf,
}) => {
  const handleReplyButton = () => {
    replyButtonClicked();
  };

  const handleMarkAsRead = () => {
    markAsRead();
  };
  const handleLikeButton = () => {
    likeButtonClicked();
  };

  return (
    <div>
      <div
        className={`message ${sent ? "sent" : "recieved"} align-items-center`}
        data-id={chatId}
      >
        <CheckCircle
          style={{
            color: isRead ? "#0096FF" : "gray",
            fontSize: "16px",
            margin: "5px",
          }}
        />

        <div role="button" className="message-bubble">
          {text}
        </div>

        {isThread && (
          <div
            role="button"
            className="text-primary m-2 pointer"
            onClick={handleReplyButton}
          >
            reply
          </div>
        )}

        
          {!showElementToSelf && isLiked ? (
            <ThumbUpOffAltRounded
              style={{ color: "#0096FF", fontSize: "16px", cursor: "pointer" }}
            />
          ) : (
            !showElementToSelf && <ThumbUpAltOutlined
              style={{ color: "gray", fontSize: "16px", cursor: "pointer" }}
              onClick={handleLikeButton}
            />
          )}
      
      </div>

      {children}
    </div>
  );
};

export default Message;
