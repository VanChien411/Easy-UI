import React, { useState } from "react";
import chatbotService from "../../services/chatbotService";
import ChatbotIcon from "../../../src/assets/images/chatbot.png";

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
      <style>{`
        .chatbot-icon {
          position: fixed;
          bottom: 20px;
          right: 20px;
          cursor: pointer;
          z-index: 999;
        }

        .chatbot-container {
          position: fixed;
          bottom: 80px;
          right: 20px;
          width: 320px;
          height: 460px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          font-family: Arial, sans-serif;
        }

        .chatbot-header {
          background-color: #4a90e2;
          color: white;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chatbot-controls button {
          background: none;
          border: none;
          color: white;
          margin-left: 5px;
          font-size: 14px;
          cursor: pointer;
        }

        .chatbot-messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          background-color: #f5f5f5;
        }

        .message {
          padding: 8px 12px;
          margin-bottom: 8px;
          border-radius: 20px;
          max-width: 80%;
          word-wrap: break-word;
          color: black;
          font-size: 14px;
          line-height: 1.4;
        }

        .user-message {
          background-color: #d1e7dd;
          align-self: flex-end;
          margin-left: auto;
        }

        .bot-message {
          background-color: #ffffff;
          border: 1px solid #ccc;
          align-self: flex-start;
          margin-right: auto;
        }

        .chatbot-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ccc;
          background-color: white;
        }

        .chatbot-input input {
          flex: 1;
          padding: 8px 10px;
          border-radius: 20px;
          border: 1px solid #ccc;
          outline: none;
        }

        .chatbot-input button {
          background-color: #4a90e2;
          color: white;
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          margin-left: 10px;
          cursor: pointer;
        }

        .loading {
          display: flex;
          gap: 4px;
          padding: 10px 16px;
        }

        .loading .dot {
          width: 6px;
          height: 6px;
          background-color: #888;
          border-radius: 50%;
          animation: blink 1s infinite alternate;
        }

        .loading .dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .loading .dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes blink {
          0% { opacity: 0.2; }
          100% { opacity: 1; }
        }

        .minimized {
          height: 40px;
          overflow: hidden;
        }
      `}</style>

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
