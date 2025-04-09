import React from "react";

const MessagesContainer = ({ messages, isTyping, messagesEndRef }) => (
  <div className="space-y-6 max-w-3xl mx-auto mt-4">
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex animate-fade-in transition-all duration-300 ease-in-out ${
          message.sender === "system" ? "justify-start" : "justify-end"
        }`}
      >
        {message.sender === "system" && (
          <div className="text-4xl mr-3 transition-transform duration-200 hover:scale-105">
            🤖
          </div>
        )}
        <div
          className={`max-w-[85%] sm:max-w-[80%] p-3 sm:p-4 rounded-3xl transform transition-all duration-300 ease-out hover:shadow-md ${
            message.sender === "system"
              ? "bg-turquoise text-darkBlue"
              : "bg-codyBlue text-white"
          }`}
        >
          <p className="text-sm sm:text-base font-roboto-mono font-normal leading-relaxed tracking-wide">
            {message.text}
          </p>
          {message.timestamp && (
            <span className="block text-xs font-roboto font-normal tracking-wide opacity-70 mt-2">
              {message.timestamp}
            </span>
          )}
        </div>
      </div>
    ))}
    {isTyping && (
      <div className="flex justify-start">
        <div className="max-w-[80%] p-4 rounded-3xl bg-turquoise text-darkBlue">
          <p className="text-message font-roboto-mono font-normal leading-relaxed tracking-wide">
            Typing...
          </p>
        </div>
      </div>
    )}
    <div ref={messagesEndRef} />
  </div>
);

export default MessagesContainer;
