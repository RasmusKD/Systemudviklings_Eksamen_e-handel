import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ItemsListPage from "./pages/ItemsListPage";
import CreateItemPage from "./pages/CreateItemPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import Logout from "./pages/Logout";
import ChatIcon from "./components/ChatIcon";
import { isTokenExpired } from "./utils/fetchWithAuth";
import { ChatProvider } from "./context/ChatContext";

const App: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("token");
            if (token && !isTokenExpired(token)) {
                setLoggedIn(true);
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                setLoggedIn(false);
            }
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    if (loggedIn === null) {
        return <div>Loading...</div>;
    }

    return (
        <ChatProvider>
            <div className="min-h-screen bg-gray-50">
                <Router>
                    <Navbar loggedIn={loggedIn} />
                    <div className="max-w-7xl mx-auto p-4">
                        <Routes>
                            <Route path="/" element={<ItemsListPage />} />
                            <Route
                                path="/items/new"
                                element={loggedIn ? <CreateItemPage /> : <Navigate to="/login" />}
                            />
                            <Route
                                path="/items/:id"
                                element={<ItemDetailsPage loggedIn={loggedIn} />}
                            />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/login" element={<LoginPage setLoggedIn={setLoggedIn} />} />
                            <Route
                                path="/profile"
                                element={loggedIn ? <ProfilePage /> : <Navigate to="/login" />}
                            />
                            <Route path="/logout" element={<Logout setLoggedIn={setLoggedIn} />} />
                        </Routes>
                    </div>
                    {loggedIn && <ChatIcon />}
                </Router>
            </div>
        </ChatProvider>
    );
};

export default App;

