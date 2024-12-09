import React, {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ItemsListPage from "./pages/ItemsListPage";
import CreateItemPage from "./pages/CreateItemPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { isTokenExpired } from './utils/fetchWithAuth';

const App: React.FC = () => {

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && isTokenExpired(token)) {
            localStorage.removeItem('token');
            alert('Your session has expired. Please log in again.');
            window.location.href = '/login';
        }
    }, []);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<ItemsListPage />} /> {/* Home Page */}
                <Route path="/items/new" element={<CreateItemPage />} />
                <Route path="/items/:id" element={<ItemDetailsPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default App;
