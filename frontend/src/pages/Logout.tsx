import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        alert("You have been logged out.");
        navigate("/");
    }, [navigate]);

    return null; // No UI needed
};

export default Logout;
