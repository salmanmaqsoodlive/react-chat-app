import React, { useState } from "react";

const MessageInput = (props) => {
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
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default MessageInput;
