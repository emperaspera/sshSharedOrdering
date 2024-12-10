import React from "react";
import { useNavigate } from "react-router-dom";
import { useBasket } from "/src/context/BasketContext.jsx"; // Import BasketContext

const LogoutButton = () => {
    const navigate = useNavigate();
    const { clearBasket } = useBasket(); // Get clearBasket from context

    const handleLogout = () => {
        clearBasket(); // Clear the basket state
        localStorage.clear(); // Clear all data from local storage
        alert("Logged out successfully.");
        navigate("/"); // Redirect to home or login page
        window.location.reload(); // Refresh the page
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
            Log Out
        </button>
    );
};

export default LogoutButton;
