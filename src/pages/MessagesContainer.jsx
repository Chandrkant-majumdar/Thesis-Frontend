import React from "react";

const MessagesContainer = ({ messages, isTyping, messagesEndRef }) => (
  <div className="space-y-5 max-w-3xl mx-auto">
    {/* Welcome Card at the top */}
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl p-5 shadow-lg">
      <div className="flex items-start">
        <div className="text-4xl mr-4">🩺</div>
        <div>
          <h1 className="text-xl font-bold mb-2">
            Medical Diagnostic Assistant
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            I'll help you identify potential health conditions based on your
            symptoms. Select from the symptom options or type your symptoms in
            the search box below.
          </p>
        </div>
      </div>
    </div>

    {/* Messages */}
    {messages.map((message, index) => (
      <div
        key={index}
        className={`flex animate-fadeIn transition-all duration-300 ease-in-out ${
          message.sender === "system" ? "justify-start" : "justify-end"
        }`}
      >
        {message.sender === "system" && (
          <div className="text-3xl mr-3 flex-shrink-0">
            <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center shadow">
              🤖
            </div>
          </div>
        )}
        <div
          className={`max-w-[85%] sm:max-w-[80%] p-4 rounded-2xl shadow-sm transition-all duration-300 ease-out ${
            message.sender === "system"
              ? "bg-white text-gray-800 border border-gray-100"
              : "bg-blue-600 text-white"
          }`}
        >
          <p className="text-sm font-normal leading-relaxed whitespace-pre-line">
            {message.text}
          </p>
          {message.timestamp && (
            <span className="block text-xs font-normal tracking-wide opacity-70 mt-2">
              {message.timestamp}
            </span>
          )}
        </div>
        {message.sender === "user" && (
          <div className="text-3xl ml-3 flex-shrink-0">
            <div className="bg-blue-600 h-12 w-12 rounded-full flex items-center justify-center shadow text-white">
              👤
            </div>
          </div>
        )}
      </div>
    ))}

    {/* Typing indicator */}
    {isTyping && (
      <div className="flex justify-start">
        <div className="text-3xl mr-3 flex-shrink-0">
          <div className="bg-blue-100 h-12 w-12 rounded-full flex items-center justify-center shadow">
            🤖
          </div>
        </div>
        <div className="bg-white text-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
          <div className="flex space-x-1.5">
            <div
              className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "300ms" }}
            ></div>
            <div
              className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-pulse"
              style={{ animationDelay: "600ms" }}
            ></div>
          </div>
          <span className="ml-3 text-sm text-gray-400">
            Analyzing symptoms...
          </span>
        </div>
      </div>
    )}

    <div ref={messagesEndRef} />
  </div>
);

export default MessagesContainer;
