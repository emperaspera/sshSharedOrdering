import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold text-green-600 mb-6">Order Successful!</h1>
            <p className="text-lg text-gray-700 mb-6">
                Your order has been placed successfully. Thank you for shopping with us!
            </p>
            <button
                onClick={() => navigate("/")}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
                Back to Supermarkets
            </button>
        </div>
    );
};

export default OrderSuccess;
