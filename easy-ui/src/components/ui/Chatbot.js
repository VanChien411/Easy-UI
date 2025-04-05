import { useState } from "react";
import React from "react";
import ChatbotIcon from "../../../src/assets/images/chatbot.png";
import "../../assets/styles/Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = (e) => {
    if (!e.target) return; // Ensure e.target is defined
    const rect = e.target.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDrag = (e) => {
    if (!e.target || !e.target.style || e.clientX === 0 || e.clientY === 0)
      return; // Ensure e.target and e.target.style are defined
    const newX = e.clientX - position.x;
    const newY = e.clientY - position.y;
    const imgElement = e.target;
    imgElement.style.left = `${newX}px`;
    imgElement.style.top = `${newY}px`;
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const newMessages = [...messages, { text: inputMessage, isUser: true }];
    setMessages(newMessages);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { text: "Xin chào! Tôi có thể giúp gì cho bạn?", isUser: false },
      ]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <div
          className="chatbot-icon"
          draggable="true"
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onClick={() => setIsOpen(true)}
        >
          <img
            src={ChatbotIcon}
            alt="Chatbot"
            draggable="false" // không cho ảnh kéo riêng
            style={{ pointerEvents: "none" }} // để luôn lấy sự kiện từ div
          />
        </div>
      )}

      {isOpen && (
        <div className={`chatbot-container ${isMinimized ? "minimized" : ""}`}>
          <div className="chatbot-header">
            <h3>Chatbot Assistant</h3>
            <div className="chatbot-controls">
              <button onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? (
                  <i class="fa-regular fa-window-maximize"></i>
                ) : (
                  <i class="fa-solid fa-minus"></i>
                )}
              </button>
              <button onClick={() => setIsOpen(false)}>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chatbot-messages">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${
                      message.isUser ? "user-message" : "bot-message"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>

              <div className="chatbot-input">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nhập tin nhắn..."
                />
                <button onClick={handleSendMessage}>➤</button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Chatbot;
