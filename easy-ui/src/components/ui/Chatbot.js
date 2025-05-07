import React, { useState } from "react";
import chatbotService from "../../services/chatbotService";
import ChatbotIcon from "../../../src/assets/images/chatbot.png";
import "../../assets/styles/Chatbot.css"; // Import your CSS file for styling

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);

  const handleDragStart = (e) => {
    if (!e.target) return;
    const rect = e.target.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDrag = (e) => {
    if (!e.target || !e.target.style || e.clientX === 0 || e.clientY === 0)
      return;
    const newX = e.clientX - position.x;
    const newY = e.clientY - position.y;
    const imgElement = e.target;
    imgElement.style.left = `${newX}px`;
    imgElement.style.top = `${newY}px`;
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const newMessages = [...messages, { text: inputMessage, isUser: true }];
    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage(inputMessage);
      const answer = response.answer;

      setMessages([
        ...newMessages,
        { text: answer || "Xin lỗi, tôi chưa có câu trả lời phù hợp.", isUser: false },
      ]);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      setMessages([
        ...newMessages,
        { text: "Đã có lỗi xảy ra. Vui lòng thử lại sau.", isUser: false },
      ]);
    } finally {
      setIsTyping(false);
    }
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
            draggable="false"
            style={{
              pointerEvents: "none",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
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
                  <i className="fa-regular fa-window-maximize"></i>
                ) : (
                  <i className="fa-solid fa-minus"></i>
                )}
              </button>
              <button onClick={() => setIsOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
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
                {isTyping && (
                  <div className="message bot-message loading">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                )}
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
