import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef();

  const generateBotResponse = async (history) => {
    //helper function to update chat history
    const updateHistory = (text, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.text !== "Thinking..."),
        { role: "model", text, isError },
      ]);
    };
    // Combine all user and model messages into a single string prompt
    const prompt = history.map(h => `${h.role}: ${h.text}`).join('\n');
    try {
      const response = await fetch('https://chatbot-7gvt.onrender.com/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Something went wrong!");
      updateHistory(data.text.trim());
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    //Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);
  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button
        onClick={() => setShowChatbot((prev) => !prev)}
        id="chatbot-toggler"
      >
        <span className="material-symbols-outlined">mode_comment</span>
        <span className="material-symbols-outlined">close</span>
      </button>
      <div className="chatbot-popup">
        {/* chatbot header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Chatbot</h2>
          </div>
          <button
            onClick={() => setShowChatbot((prev) => !prev)}
            className="material-symbols-outlined"
          >
            keyboard_arrow_down
          </button>
        </div>

        {/* chatbot body */}

        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there!! <br /> how can I help you today?
            </p>
          </div>
          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* chatbot footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
