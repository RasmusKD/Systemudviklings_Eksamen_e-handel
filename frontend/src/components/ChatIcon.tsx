import React from "react";
import { MessageCircle } from 'lucide-react';
import ChatWindow from "./ChatWindow";
import { useChat } from "../context/ChatContext";

const ChatIcon: React.FC = () => {
    const { activeChats, currentChat, setCurrentChat, isChatOpen, setIsChatOpen } = useChat();

    const handleSwitchChat = (chat: any) => {
        setCurrentChat(chat);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <button
                className="bg-indigo-600 p-3 rounded-full shadow-lg text-white hover:bg-indigo-700 transition-colors duration-200"
                onClick={() => setIsChatOpen(!isChatOpen)}
            >
                <MessageCircle className="w-6 h-6" />
                {activeChats.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {activeChats.length}
                    </span>
                )}
            </button>
            {isChatOpen && (
                <ChatWindow
                    onClose={() => setIsChatOpen(false)}
                    activeChats={activeChats}
                    currentChat={currentChat}
                    onSwitchChat={handleSwitchChat}
                />
            )}
        </div>
    );
};

export default ChatIcon;

