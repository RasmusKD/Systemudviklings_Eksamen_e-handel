import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, PlusCircle, LogOut, Search } from 'lucide-react';

interface NavbarProps {
    loggedIn: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ loggedIn }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-indigo-600 flex items-center">
                    <ShoppingBag className="mr-2" />
                    Markedsplads
                </Link>
                <form onSubmit={handleSearch} className="relative flex-1 max-w-xl mx-4">
                    <input
                        type="text"
                        placeholder="Søg efter alt..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                        <Search className="w-5 h-5" />
                    </button>
                </form>
                <ul className="flex space-x-6 text-gray-700 items-center">
                    {loggedIn ? (
                        <>
                            <li>
                                <Link
                                    to="/items/new"
                                    className={`flex items-center hover:text-indigo-600 transition-colors ${
                                        location.pathname === '/items/new' ? 'text-indigo-600 font-semibold' : ''
                                    }`}
                                >
                                    <PlusCircle className="mr-1" />
                                    Opret
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/profile"
                                    className={`flex items-center hover:text-indigo-600 transition-colors ${
                                        location.pathname === '/profile' ? 'text-indigo-600 font-semibold' : ''
                                    }`}
                                >
                                    <User className="mr-1" />
                                    Profil
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    <LogOut className="mr-1" />
                                    Log ud
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className={`hover:text-indigo-600 transition-colors ${
                                        location.pathname === '/login' ? 'text-indigo-600 font-semibold' : ''
                                    }`}
                                >
                                    Log ind
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className={`bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors ${
                                        location.pathname === '/register' ? 'ring-2 ring-indigo-300' : ''
                                    }`}
                                >
                                    Tilmeld
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

