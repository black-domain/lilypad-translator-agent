import React, { useState, useRef, useEffect } from 'react';
import './ChatDialog.css';
import { run } from '../tools/storacha';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  initialMessages?: Message[];
  botAvatar?: string;
  userAvatar?: string;
  showCloseButton?: boolean;
}

const ChatDialog: React.FC<ChatDialogProps> = ({
  isOpen,
  onClose,
  title = 'Chat assistant',
  initialMessages = [],
  botAvatar = 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
  userAvatar = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  showCloseButton = true,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await run({ message: inputValue, onSendMessage: (v) => { addBotMessage(v); } });
      if (result) {
        addBotMessage(result)
      } else {
        addBotMessage(`Sorry, we couldn't find the results you were looking for.`)
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addBotMessage = (text: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="chat-dialog-container" onClick={handleBackdropClick}>
      <div className="chat-dialog-content">
        <div className="chat-dialog-header">
          <div className="chat-dialog-title-container">
            <img src={botAvatar} alt="Bot Avatar" className="chat-dialog-bot-avatar" />
            <h3 className="chat-dialog-title">{title}</h3>
          </div>
          {showCloseButton && (
            <button className="chat-dialog-close-button" onClick={onClose}>
              &times;
            </button>
          )}
        </div>

        <div className="chat-dialog-messages">
          {messages.length === 0 ? (
            <div className="chat-dialog-empty-state">
              <p>Welcome to chat with me!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="chat-message-avatar">
                  <img
                    src={message.sender === 'user' ? userAvatar : botAvatar}
                    alt={`${message.sender} avatar`}
                  />
                </div>
                <div className="chat-message-content">
                  <div className="chat-message-text">{message.text}</div>
                  <div className="chat-message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="chat-message bot-message">
              <div className="chat-message-avatar">
                <img src={botAvatar} alt="Bot Avatar" />
              </div>
              <div className="chat-message-content">
                <div className="chat-message-text typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-dialog-input-container">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter message..."
            className="chat-dialog-input"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="chat-dialog-send-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDialog;