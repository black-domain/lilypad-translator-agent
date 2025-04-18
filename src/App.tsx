import React, { useState } from 'react';
import './App.css';
import ChatDialog from './component/ChatDialog';

const App: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <div className="app-container">
            <div className="app-content">
                <div>Hi, I'm Translation AI.</div>
                <button
                    className="chat-button"
                    onClick={() => setIsChatOpen(true)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z"
                            clipRule="evenodd"
                        />
                    </svg>
                    Start Chatting
                </button>
            </div>

            <ChatDialog
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                title="Translation AI"

                initialMessages={[
                    {
                        id: '1',
                        text: 'Hello! I am an AI assistant. How can I help you?',
                        sender: 'bot',
                        timestamp: new Date(),
                    },
                ]}
            />
        </div>
    );
};

export default App;