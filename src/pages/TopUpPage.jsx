// TopUpPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TopUpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [topUpAmount, setTopUpAmount] = useState(location.state?.prefilledAmount || "");
    const [cardNumber, setCardNumber] = useState("");
    const [topUpMessage, setTopUpMessage] = useState("");
    const [topUpError, setTopUpError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderDetails, setOrderDetails] = useState(location.state?.orderDetails || null);

    useEffect(() => {
        if (!orderDetails) {
            navigate("/main/account");
        }
    }, [orderDetails, navigate]);

    const handleTopUp = async () => {
        setTopUpMessage("");
        setTopUpError("");

        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.user_id) {
            setTopUpError("User information is missing. Please log in again.");
            return;
        }

        const amount = parseFloat(topUpAmount);
        if (isNaN(amount) || amount <= 0) {
            setTopUpError("Please enter a valid top-up amount.");
            return;
        }

        if (!/^\d{16}$/.test(cardNumber)) {
            setTopUpError("Card number must be exactly 16 digits.");
            return;
        }

        setIsSubmitting(true);

        try {
            console.log("Sending top-up request with:", {
                userId: user.user_id,
                amount: amount,
                cardNumber: cardNumber,
            });

            const response = await fetch("http://localhost:5000/api/top-up", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: user.user_id,
                    amount: amount,
                    cardNumber: cardNumber,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Top-up failed.");
            }

            setTopUpMessage("Top-up successful!");

            // If there are orderDetails, proceed to place the order
            if (orderDetails) {
                const { items, total, deliveryDate, deliveryFee, serviceFee, tax, userId, householdId } = orderDetails;

                const placeOrderResponse = await fetch("http://localhost:5000/api/place-order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        items,
                        total,
                        deliveryDate,
                        deliveryFee,
                        serviceFee,
                        tax,
                        userId,
                        householdId,
                    }),
                });

                const placeOrderData = await placeOrderResponse.json();

                if (!placeOrderResponse.ok) {
                    throw new Error(placeOrderData.error || "Failed to place order after top-up.");
                }

                // If order placement is successful, navigate to Order Success Page
                navigate("/main/order-success");
            } else {
                // If no orderDetails, navigate back to Account Page
                navigate("/main/account", { replace: true });
            }
        } catch (error) {
            console.error("Top-up error:", error);
            setTopUpError(error.message || "An error occurred during top-up.");
        }

        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Up Your Account</h2>
                {topUpMessage && <p className="text-green-500 mb-4">{topUpMessage}</p>}
                {topUpError && <p className="text-red-500 mb-4">{topUpError}</p>}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Amount ($)</label>
                    <input
                        type="number"
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="Enter amount to top up"
                        min="1"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Card Number</label>
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="Enter 16-digit card number"
                        maxLength={16}
                    />
                </div>
                <button
                    onClick={handleTopUp}
                    className={`w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ${
                        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Processing..." : "Top Up"}
                </button>
            </div>
        </div>
    );
};

export default TopUpPage;
