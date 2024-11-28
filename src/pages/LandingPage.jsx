import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome!</h1>
            <p className="text-lg text-gray-600 mb-6">
                Click the button below to open the Groceries App.
            </p>
            <button
                onClick={() => navigate("/main")}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
            >
                Open the Groceries App
            </button>
        </div>
    );
};

export default LandingPage;
