import React, { useState } from "react";
import styled from "styled-components";

const UserInput = () => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // Add functionality to send message here
      setMessage("");
    }
  };

  return (
    <InputContainer>
      <Input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <SendButton onClick={handleSend}>Send</SendButton>
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  padding: 10px;
  border-top: 1px solid #e0e0e0;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
`;

const SendButton = styled.button`
  margin-left: 10px;
  padding: 10px 15px;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  border: none;
`;

export default UserInput;
