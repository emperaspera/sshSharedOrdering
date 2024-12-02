import React from "react";
import {useNavigate} from "react-router-dom";
import Navigation from "../components/Navigation/Navigation.jsx";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navigation/>
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Groceries App!</h1>
                <p className="text-lg text-gray-600 mb-6">Manage your groceries efficiently.</p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate("/signup")}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition"
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => navigate("/table-desk-login")}
                        className="bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-purple-600 transition"
                    >
                        Table Desk Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
