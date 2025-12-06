
// FloatingGeminiChat.jsx
import React, { useState, useRef, useEffect } from "react";

/**
 * FloatingGeminiChat (frontend)
 * - Calls backend at `${API_URL}/api/chat` to get AI responses.
 * - Do NOT add API keys here. Keep keys on the server.
 *
 * If you want to use a full URL instead of relative path, change API_URL to:
 *   const API_URL = "http://localhost:3001"
 */
const API_URL = "http://localhost:3001"; // leave blank to use relative path '/api/chat' (works with proxy), or set e.g. "http://localhost:3001"

export default function FloatingGeminiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true); // Default minimized
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when expanded & not minimized
  useEffect(() => {
    if (isExpanded && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded, isMinimized]);

  // Handle click outside to close chat
  useEffect(() => {
    function handleClickOutside(event) {
      // Don't close if clicking on minimized button or quick actions
      if (isMinimized) return;
      
      // Don't close if clicking inside the chat container
      if (chatContainerRef.current && chatContainerRef.current.contains(event.target)) {
        return;
      }
      
      // Don't close if clicking on the minimized floating button
      const floatingButton = document.querySelector('.floating-button.minimized');
      if (floatingButton && floatingButton.contains(event.target)) {
        return;
      }
      
      // Don't close if clicking on quick action buttons
      const quickActions = document.querySelector('.quick-actions');
      if (quickActions && quickActions.contains(event.target)) {
        return;
      }
      
      // Close chat if clicking outside
      if (isExpanded && !isMinimized) {
        closeChat();
      }
    }

    // Add event listener only when chat is expanded
    if (isExpanded && !isMinimized) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isExpanded, isMinimized]);

  // Helper to get formatted timestamp HH:MM
  const nowTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Send message -> POST to backend which calls Gemini securely
  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Auto-expand when sending message from minimized state
    if (!isExpanded) setIsExpanded(true);
    if (isMinimized) setIsMinimized(false);

    // Add user message immediately (optimistic UI)
    setMessages((prev) => [
      ...prev,
      {
        text: userMessage,
        sender: "user",
        timestamp: nowTimestamp(),
      },
    ]);

    try {
      const endpoint = (API_URL || "") + "/api/chat";
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45_000); // 45s timeout

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ message: userMessage }),
      });

      clearTimeout(timeout);

      if (!res.ok) {
        // Try to parse JSON error, otherwise fallback to text
        let errMsg = `Server error ${res.status}`;
        try {
          const body = await res.json();
          errMsg = body?.error ?? body?.message ?? errMsg;
        } catch {
          try {
            const txt = await res.text();
            if (txt) errMsg = txt;
          } catch {}
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      const botText = data?.text ?? data?.reply ?? data?.message ?? "Sorry, I couldn't get a reply.";

      setMessages((prev) => [
        ...prev,
        {
          text: botText,
          sender: "bot",
          timestamp: nowTimestamp(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: nowTimestamp(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const openChat = (e) => {
    if (e) {
      e.stopPropagation(); // Prevent event bubbling
    }
    setIsMinimized(false);
    setIsExpanded(true);
    // Focus input after a small delay to ensure chat is fully rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const closeChat = (e) => {
    if (e) {
      e.stopPropagation(); // Prevent event bubbling
    }
    setIsMinimized(true);
    setIsExpanded(false);
  };

  const toggleChat = (e) => {
    if (e) {
      e.stopPropagation(); // Prevent event bubbling
    }
    if (isMinimized) openChat(e);
    else closeChat(e);
  };

  const quickQuestion = (question) => {
    setInput(question);
    openChat();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Handle header click - toggle expand/collapse only
  const handleHeaderClick = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    if (!isExpanded && isMinimized) {
      setIsMinimized(false);
    }
  };

  // Minimized floating button UI
  if (isMinimized) {
    return (
      <div className="floating-chat-wrapper">
        {/* Minimized Floating Button */}
        <button className="floating-button minimized" onClick={openChat} title="Open Chat">
          <div
            className="gemini-logo"
            style={{
              backgroundColor: "black",
              padding: "6px",
              borderRadius: "8px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src="/img/logo.png" alt="Gemini Logo" className="gemini-icon" style={{ width: "28px", height: "28px" }} />
          </div>
          {messages.length > 0 && <span className="notification-badge">{messages.length}</span>}
          <div className="pulse-ring"></div>
        </button>

        {/* Quick Action Menu (appears on hover) */}
        <div className="quick-actions">
          <button className="quick-action-btn" onClick={() => quickQuestion("Hello!")} title="Say hello">
            👋
          </button>
          <button className="quick-action-btn" onClick={() => quickQuestion("Help me with something")} title="Get help">
            🤔
          </button>
          <button className="quick-action-btn" onClick={() => quickQuestion("What can you do?")} title="Learn more">
            ❓
          </button>
        </div>

        <style jsx>{`
          .floating-chat-wrapper {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
          }

          .floating-button.minimized {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            animation: float 6s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(5deg);
            }
          }

          .floating-button.minimized:hover {
            transform: scale(1.15) rotate(10deg);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.8);
          }

          .floating-button.minimized:active {
            transform: scale(0.95);
          }

          .chat-icon {
            animation: sparkle 2s ease-in-out infinite;
          }

          @keyframes sparkle {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ff4757;
            color: white;
            font-size: 12px;
            min-width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            padding: 0 4px;
            animation: pulse 2s infinite;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          }

          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }

          .pulse-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid rgba(102, 126, 234, 0.4);
            animation: ring-pulse 2s ease-out infinite;
          }

          @keyframes ring-pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }

          .quick-actions {
            position: absolute;
            bottom: 80px;
            right: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            pointer-events: none;
          }

          .floating-button.minimized:hover + .quick-actions {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
          }

          .quick-actions:hover {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
          }

          .quick-action-btn {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: rgba(26, 26, 46, 0.9);
            border: 2px solid rgba(102, 126, 234, 0.3);
            color: white;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }

          .quick-action-btn:hover {
            transform: scale(1.1) translateX(-5px);
            background: rgba(102, 126, 234, 0.9);
            border-color: rgba(102, 126, 234, 0.8);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }
        `}</style>
      </div>
    );
  }

  // Expanded/Collapsed View (keeps full UI + styles)
  return (
    <div className="floating-chat-wrapper">
      <div 
        ref={chatContainerRef}
        className={`floating-chat-container ${isExpanded ? "expanded" : "collapsed"}`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Chat Header */}
        <div className="chat-header" onClick={handleHeaderClick}>
          <div className="header-content">
            <div className="header-left">
              <div
                className="gemini-logo"
                style={{
                  backgroundColor: "black",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img src="/img/logo.png" alt="Gemini Logo" className="gemini-icon" style={{ width: "28px", height: "28px" }} />
              </div>

              <div>
                <h3>HiTechElex AI Assistant</h3>
                <p className="status">
                  {isExpanded ? "Online • Ready to help" : "Click to expand"}
                  {messages.length > 0 && ` • ${messages.length} messages`}
                </p>
              </div>
            </div>
            <div className="header-actions">
              {isExpanded && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearChat();
                    }}
                    className="icon-btn"
                    title="Clear chat"
                    disabled={messages.length === 0}
                  >
                    🗑️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      closeChat();
                    }}
                    className="icon-btn minimize-btn"
                    title="Minimize to dock"
                  >
                    _
                  </button>
                </>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="icon-btn expand-btn"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? "▼" : "▲"}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <>
            {/* Messages Container */}
            <div className="messages-container">
              {messages.length === 0 ? (
                <div className="empty-state">
                  <div className="welcome-icon"></div>
                  <h4>Welcome to HiTechElex AI!</h4>
                  <p>I'm here to help you with any questions.</p>
                  <div className="suggestions-grid">
                    <button onClick={() => quickQuestion("automatic dehumidifier & temp controller")}>
                      <span></span>
                      <span>automatic dehumidifier & temp controller</span>
                    </button>
                    <button onClick={() => quickQuestion("digital lightning arrester monitoring device")}>
                      <span></span>
                      <span>digital lightning arrester monitoring device</span>
                    </button>
                    <button onClick={() => quickQuestion("panel health monitoring system")}>
                      <span></span>
                      <span>panel health monitoring system</span>
                    </button>
                    <button onClick={() => quickQuestion("e-daq energy data acquisition")}>
                      <span></span>
                      <span>e-daq energy data acquisition</span>
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender} ${msg.isError ? "error" : ""}`}>
                    <div className="message-header">
                      <span className="sender">{msg.sender === "user" ? "You" : "HiTechElex AI Assistant"}</span>
                      <span className="timestamp">{msg.timestamp}</span>
                    </div>
                    <div className="message-content">{msg.text}</div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="message bot">
                  <div className="message-header">
                    <span className="sender">HiTechElex AI Assistant</span>
                    <span className="timestamp">typing...</span>
                  </div>
                  <div className="message-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="input-container">
              <div className="input-wrapper">
                <textarea
                  ref={inputRef}
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows="1"
                  disabled={isLoading}
                  autoFocus
                  onClick={(e) => e.stopPropagation()} // Prevent click from closing
                />
                <button onClick={(e) => { e.stopPropagation(); sendMessage(); }} className="send-btn" disabled={isLoading || !input.trim()} title="Send message">
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="input-hint">Press Enter to send • Shift + Enter for new line</div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .floating-chat-wrapper {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
        }

        .floating-chat-container {
          width: 380px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: white;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 70vh;
          z-index: 9999;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .floating-chat-container.collapsed {
          height: 76px;
          cursor: pointer;
          animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-chat-container.expanded {
          height: 65vh;
          min-height: 500px;
          max-height: 700px;
          animation: expand 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from {
            transform: translateY(100px) scale(0.8);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        @keyframes expand {
          from {
            height: 76px;
            transform: scale(0.9);
            opacity: 0.8;
          }
          to {
            height: 65vh;
            transform: scale(1);
            opacity: 1;
          }
        }

        .chat-header {
          padding: 18px;
          background: rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
          user-select: none;
          backdrop-filter: blur(10px);
        }

        .chat-header:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .gemini-logo {
          font-size: 26px;
          background: linear-gradient(135deg, #232427ff 0%, #190b27ff 100%);
          width: 44px;
          height: 44px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          from {
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
          }
          to {
            box-shadow: 0 0 30px rgba(15, 15, 15, 0.8);
          }
        }

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status {
          margin: 4px 0 0 0;
          font-size: 12px;
          opacity: 0.7;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .icon-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .icon-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .icon-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .minimize-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .expand-btn {
          background: linear-gradient(135deg, #060a1cff 0%, #0b090cff 100%);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: rgba(0, 0, 0, 0.1);
          min-height: 0;
        }

        .empty-state {
          text-align: center;
          margin: auto;
          padding: 20px;
          max-width: 320px;
        }

        .welcome-icon {
          font-size: 52px;
          margin-bottom: 20px;
          opacity: 0.8;
          animation: bounce 3s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .empty-state h4 {
          margin: 0 0 10px 0;
          font-size: 20px; 
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          opacity: 0.8;
          font-size: 15px;
        }

        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .suggestions-grid button {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s;
          text-align: left;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
        }

        .suggestions-grid button:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          border-color: rgba(102, 126, 234, 0.5);
        }

        .suggestions-grid button span:first-child {
          font-size: 18px;
          margin-bottom: 4px;
        }

        .message {
          max-width: 85%;
          animation: fadeIn 0.3s ease-out;
        }

        .message.user {
          align-self: flex-end;
        }

        .message.bot {
          align-self: flex-start;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          font-size: 11px;
          opacity: 0.8;
        }

        .sender {
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 10px;
        }

        .timestamp {
          font-size: 9px;
          opacity: 0.7;
        }

        .message-content {
          padding: 14px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.6;
          word-wrap: break-word;
          backdrop-filter: blur(10px);
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-bottom-right-radius: 4px;
          color: white;
        }

        .message.bot .message-content {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-bottom-left-radius: 4px;
          color: rgba(255, 255, 255, 0.95);
        }

        .message.error .message-content {
          background: rgba(220, 53, 69, 0.15);
          border: 1px solid rgba(220, 53, 69, 0.3);
          color: #ff6b6b;
        }

        .typing-indicator {
          display: flex;
          gap: 5px;
          padding: 10px 0;
        }

        .typing-indicator span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: typing 1.4s infinite both;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .input-container {
          padding: 18px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
        }

        .input-wrapper {
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        textarea {
          flex: 1;
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 14px;
          padding: 14px 18px;
          color: white;
          font-family: inherit;
          font-size: 14px;
          resize: none;
          min-height: 48px;
          max-height: 120px;
          outline: none;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        textarea:focus {
          border-color: #667eea;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        textarea::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .input-hint {
          text-align: center;
          font-size: 11px;
          opacity: 0.5;
          margin-top: 10px;
          letter-spacing: 0.3px;
        }

        /* Scrollbar styling */
        .messages-container::-webkit-scrollbar {
          width: 6px;
        }

        .messages-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }

        .messages-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Mobile responsiveness */
        @media (max-width: 480px) {
          .floating-chat-wrapper {
            bottom: 16px;
            right: 16px;
            left: 16px;
          }

          .floating-button.minimized {
            width: 56px;
            height: 56px;
            font-size: 24px;
          }

          .floating-chat-container {
            width: 100%;
          }

          .floating-chat-container.expanded {
            height: 70vh;
            min-height: 450px;
          }

          .suggestions-grid {
            grid-template-columns: 1fr;
          }

          .quick-actions {
            bottom: 70px;
          }

          .quick-action-btn {
            width: 44px;
            height: 44px;
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
}