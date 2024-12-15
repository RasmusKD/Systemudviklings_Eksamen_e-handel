import React, { useState, useRef, useEffect } from "react";
import { X } from 'lucide-react';

interface ChatWindowProps {
    onClose: () => void;
    activeChats: any[];
    currentChat: any;
    onSwitchChat: (chat: any) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
                                                   onClose,
                                                   activeChats,
                                                   currentChat,
                                                   onSwitchChat,
                                               }) => {
    const [messageInput, setMessageInput] = useState("");
    const [chatMessages, setChatMessages] = useState<Record<string, any[]>>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (currentChat && currentChat._id) {
            if (!chatMessages[currentChat._id]) {
                // Fetch messages for the current chat if they're not already loaded
                fetchChatMessages(currentChat._id);
            } else {
                // If messages are already loaded, scroll to bottom
                scrollToBottom();
            }
        }
    }, [currentChat]);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    const fetchChatMessages = async (chatId: string) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/chats/${chatId}/messages`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.ok) {
                const messages = await response.json();
                setChatMessages(prevMessages => ({
                    ...prevMessages,
                    [chatId]: messages
                }));
            } else {
                console.error("Failed to fetch chat messages");
            }
        } catch (error) {
            console.error("Error fetching chat messages:", error);
        }
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !currentChat?._id) return;

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/chats/${currentChat._id}/messages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ text: messageInput }),
                }
            );

            if (response.ok) {
                const newMessage = await response.json();
                setChatMessages(prevMessages => ({
                    ...prevMessages,
                    [currentChat._id]: [...(prevMessages[currentChat._id] || []), newMessage]
                }));
                setMessageInput("");
            } else {
                console.error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="bg-white shadow-2xl rounded-lg fixed bottom-16 right-4 w-96 h-[32rem] flex flex-col overflow-hidden">
            <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold">Chat</h2>
                <button onClick={onClose} className="text-white hover:text-red-200">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-none p-2 border-b overflow-x-auto whitespace-nowrap">
                {activeChats.map((chat) => (
                    <button
                        key={chat._id}
                        onClick={() => onSwitchChat(chat)}
                        className={`inline-block w-12 h-12 rounded-full overflow-hidden mr-2 ${
                            currentChat?._id === chat._id ? "ring-2 ring-indigo-500" : "border"
                        }`}
                    >
                        {chat.itemImage ? (
                            <img
                                src={chat.itemImage}
                                alt="Chat Item"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="bg-gray-300 w-full h-full flex items-center justify-center">
                                N/A
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {currentChat && (
                    <div className="flex-none bg-white p-3 border-b shadow-sm">
                        <h3 className="text-lg font-bold text-indigo-600">
                            Dig {'>'} {currentChat.sellerName}
                        </h3>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {currentChat && chatMessages[currentChat._id]?.map((message: any, index: number) => (
                            <div
                                key={`${currentChat._id}-message-${index}`}
                                className={`flex ${
                                    message.senderId === currentChat.sellerId ? "justify-start" : "justify-end"
                                }`}
                            >
                                <div
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        message.senderId === currentChat.sellerId
                                            ? "bg-gray-200 text-gray-800"
                                            : "bg-indigo-600 text-white"
                                    }`}
                                >
                                    <p className="text-sm">{message.text}</p>
                                    <p className="text-xs mt-1 opacity-70">
                                        {new Date(message.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>

            <div className="flex-none p-4 bg-gray-100">
                <input
                    type="text"
                    value={messageInput}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Type a message..."
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default ChatWindow;

