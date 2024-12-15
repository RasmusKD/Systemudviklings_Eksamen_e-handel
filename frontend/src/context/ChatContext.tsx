import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface ChatContextType {
    activeChats: any[];
    setActiveChats: React.Dispatch<React.SetStateAction<any[]>>;
    currentChat: any | null;
    setCurrentChat: React.Dispatch<React.SetStateAction<any | null>>;
    handleContactSeller: (
        itemId: string,
        sellerId: string,
        itemName: string,
        sellerName: string,
        itemImage: string
    ) => Promise<any>;
    isChatOpen: boolean;
    setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ChatProviderProps {
    children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [activeChats, setActiveChats] = useState<any[]>(() => {
        const storedChats = localStorage.getItem("activeChats");
        return storedChats ? JSON.parse(storedChats) : [];
    });

    const [currentChat, setCurrentChat] = useState<any | null>(() => {
        const storedChat = localStorage.getItem("currentChat");
        return storedChat ? JSON.parse(storedChat) : null;
    });

    const [isChatOpen, setIsChatOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("activeChats", JSON.stringify(activeChats));
    }, [activeChats]);

    useEffect(() => {
        if (currentChat) {
            localStorage.setItem("currentChat", JSON.stringify(currentChat));
        }
    }, [currentChat]);

    const handleContactSeller = async (
        itemId: string,
        sellerId: string,
        itemName: string,
        sellerName: string,
        itemImage: string
    ) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found. User might not be logged in.");
                return;
            }

            if (!sellerId) {
                console.error("Seller ID is missing.");
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/chats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ itemId, sellerId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error creating/fetching chat:", errorText);
                return;
            }

            const chat = await response.json();

            const updatedChat = {
                ...chat,
                itemName,
                sellerName,
                itemImage,
            };

            const existingChat = activeChats.find((c) => c._id === updatedChat._id);
            if (!existingChat) {
                setActiveChats((prevChats) => [...prevChats, updatedChat]);
            }

            setCurrentChat(updatedChat);
            return updatedChat;
        } catch (error) {
            console.error("Error contacting seller:", error);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                activeChats,
                setActiveChats,
                currentChat,
                setCurrentChat,
                handleContactSeller,
                isChatOpen,
                setIsChatOpen,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};

