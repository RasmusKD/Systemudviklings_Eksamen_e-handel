import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface LogoutProps {
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const Logout: React.FC<LogoutProps> = ({ setLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("activeChats");
        localStorage.removeItem("currentChat");

        setLoggedIn(false);

        alert("You have been logged out.");
        navigate("/");
    }, [navigate, setLoggedIn]);

    return null;
};

export default Logout;
