import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
    const location = useLocation();

    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <ul className="flex space-x-4">
                <li>
                    <Link
                        to="/"
                        className={location.pathname === "/" ? "font-bold" : ""}
                    >
                        Home
                    </Link>
                </li>
                {isLoggedIn && (
                    <li>
                        <Link
                            to="/items/new"
                            className={location.pathname === "/items/new" ? "font-bold" : ""}
                        >
                            Create Item
                        </Link>
                    </li>
                )}
                {!isLoggedIn ? (
                    <>
                        <li>
                            <Link
                                to="/login"
                                className={location.pathname === "/login" ? "font-bold" : ""}
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/register"
                                className={location.pathname === "/register" ? "font-bold" : ""}
                            >
                                Register
                            </Link>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link
                            to="/logout"
                            className={location.pathname === "/logout" ? "font-bold" : ""}
                        >
                            Logout
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
