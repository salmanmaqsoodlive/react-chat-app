import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
const MessageInput = (props) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleInputChange = (event) => {
    props.onChange(event);
  };

  const handleFileChange = (event) => {
    props.handleFileInputChange(event);
  };

  const handleSendMessage = () => {
    props.onClick();
  };

  return (
    <div className="message-input">
      {!props.isThread && <input type="file" onChange={handleFileChange} />}
      <textarea
        placeholder={props.placeholder}
        value={props.inputValue}
        onChange={handleInputChange}
      />
      {/* <p
        onMouseEnter={() => setShowEmojiPicker(true)}
        onMouseLeave={() => setShowEmojiPicker(false)}
      >
        emoji
      </p>

      {showEmojiPicker && <Picker data={data} onEmojiSelect={console.log} />} */}
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
