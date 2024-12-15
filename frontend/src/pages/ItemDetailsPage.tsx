import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import { MessageCircle, Truck, Tag } from 'lucide-react';

interface ItemDetailsPageProps {
    loggedIn: boolean;
}

interface User {
    _id: string;
    username: string;
    email: string;
}

interface Item {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    canBeSent: boolean;
    userId: string;
    image: string;
}

const ItemDetailsPage: React.FC<ItemDetailsPageProps> = ({ loggedIn }) => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<Item | null>(null);
    const [seller, setSeller] = useState<User | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const { handleContactSeller, setCurrentChat, setIsChatOpen } = useChat();
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setCurrentUserId(userId);
    }, []);

    useEffect(() => {
        const fetchItem = async () => {
            if (!id) return;
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/items/${id}`);
                if (response.ok) {
                    const data: Item = await response.json();
                    setItem(data);
                    console.log("Fetched item data:", data);
                    fetchSellerInfo(data.userId);
                } else {
                    console.error("Failed to fetch item details");
                }
            } catch (error) {
                console.error("Error fetching item details:", error);
            }
        };

        const fetchSellerInfo = async (userId: string) => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error("No token found. User might not be logged in.");
                    return;
                }
                const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const userData: User = await response.json();
                    setSeller(userData);
                    console.log("Fetched seller data:", userData);
                } else {
                    console.error("Failed to fetch seller details. Status:", response.status);
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                }
            } catch (error) {
                console.error("Error fetching seller details:", error);
            }
        };

        fetchItem();
    }, [id]);

    const handleOpenChat = () => {
        if (!loggedIn) {
            navigate('/login');
            return;
        }
        if (item && seller) {
            const newChat = handleContactSeller(
                id!,
                seller._id,
                item.title,
                seller.username,
                `${process.env.REACT_APP_BASE_URL}/uploads/${item.image}`
            );
            setCurrentChat(newChat);
            setIsChatOpen(true);
        }
    };

    if (!item) {
        return <div className="p-4 text-center">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-grow">
                        <div className="aspect-w-16 aspect-h-9">
                            <img
                                className="object-cover w-full h-full"
                                src={`${process.env.REACT_APP_BASE_URL}/uploads/${item.image}`}
                                alt={item.title}
                            />
                        </div>
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{item.category}</div>
                            <h1 className="mt-1 text-3xl font-bold text-gray-900">{item.title}</h1>
                            <p className="mt-2 text-gray-600">{item.description}</p>
                            <div className="mt-4 flex items-center">
                                <Tag className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-2xl font-bold text-indigo-600">{item.price} kr.</span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <Truck className="h-5 w-5 text-gray-400 mr-2" />
                                <span className="text-gray-600">{item.canBeSent ? "Kan sendes" : "Kun afhentning"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/3 border-l border-gray-200 p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Seller Information</h2>
                        {loggedIn ? (
                            <>
                                <p className="text-gray-600 mb-4">Username: {seller?.username || "Loading..."}</p>
                                {currentUserId !== item.userId ? (
                                    <button
                                        onClick={handleOpenChat}
                                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <MessageCircle className="mr-2 h-5 w-5" />
                                        Contact Seller
                                    </button>
                                ) : (
                                    <div className="bg-gray-100 p-4 rounded-md text-center text-gray-700">
                                        This is your listing
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-600">Please log in to see seller information and contact the seller.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetailsPage;

