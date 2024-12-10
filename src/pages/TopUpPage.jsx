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
    const [userBalance, setUserBalance] = useState(null);

    const [isRedirecting, setIsRedirecting] = useState(false);



    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User from localStorage:", user);
        console.log("Location state:", location.state);

        if (!user) {
            console.warn("User not found! Redirecting to account page...");
            navigate("/main/account", { replace: true });
            return;
        }

        // Uncomment this only if necessary
        // if (!location.state?.prefilledAmount && !location.state?.message) {
        //     console.warn("Invalid location.state! Redirecting...");
        //     navigate("/main/account", { replace: true });
        // }
    }, [location.state, navigate]);


    const updateLocalStorageAfterTopUp = async (userId) => {
        try {
            console.log("Fetching user data for userId:", userId);
            if (!userId) throw new Error("Invalid userId provided.");

            const response = await fetch(`http://localhost:5000/api/user/${userId}`); // Ensure this matches the backend route
            if (!response.ok) {
                if (response.status === 404) throw new Error("User not found.");
                throw new Error("Failed to fetch user data.");
            }

            const userData = await response.json();

            // Update localStorage with the updated user data
            localStorage.setItem("user", JSON.stringify(userData.user));

            return userData;
        } catch (error) {
            console.error("Error updating localStorage after top-up:", error);
            throw error; // Re-throw to handle it in the calling function
        }
    };


    const fetchUpdatedBalance = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/user-balance/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch updated balance.");
            const data = await response.json();
            console.log("Fetched Updated Balance:", data.balance); // Debugging log
            setUserBalance(parseFloat(data.balance));
            return parseFloat(data.balance);
        } catch (error) {
            console.error("Error fetching updated balance:", error);
            setTopUpError("Failed to fetch updated balance. Please try again.");
            return null;
        }
    };

    const handleTopUp = async () => {
        setTopUpMessage("");
        setTopUpError("");
        setIsSubmitting(true);
    
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.user_id) {
            setTopUpError("User information is missing. Please log in again.");
            setIsSubmitting(false);
            return;
        }
    
        const amount = parseFloat(topUpAmount);
        if (isNaN(amount) || amount <= 0 || amount > 99999.99) {
            setTopUpError("Please enter a valid top-up amount (up to $99,999.99).");
            setIsSubmitting(false);
            return;
        }
    
        if (!/^\d{16}$/.test(cardNumber)) {
            setTopUpError("Card number must be exactly 16 digits.");
            setIsSubmitting(false);
            return;
        }
    
        try {
            console.log("Sending top-up request:", { userId: user.user_id, amount, cardNumber });
            const topUpResponse = await fetch("http://localhost:5000/api/top-up", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.user_id, amount, cardNumber }),
            });
    
            const topUpData = await topUpResponse.json();
            if (!topUpResponse.ok) throw new Error(topUpData.error || "Top-up failed.");
    
            setTopUpMessage("Top-up successful!");
            console.log("Updated Balance:", topUpData.updatedBalance);
    
            // Fetch updated balance after top-up
            const updatedBalance = await fetchUpdatedBalance(user.user_id);
            if (updatedBalance === null) {
                throw new Error("Failed to fetch updated balance after top-up.");
            }
    
            console.log("Updated Balance After Fetch:", updatedBalance);
    
            if (updatedBalance >= 0) {
                console.log("Redirecting to the main screen...");
                setTimeout(() => navigate("/main", { replace: true }), 100);
            } else {
                setTopUpMessage(
                    `Top-up successful! However, you still need to top up $${Math.abs(updatedBalance).toFixed(2)} to unlock your account.`
                );
            }
    
            // If there are orderDetails, proceed to place the order
            if (orderDetails) {
                console.log("Order Details:", orderDetails);
                const { items, deliveryDate, deliveryFee, serviceFee, tax, total, householdId} = orderDetails;
    
                // Ensure all necessary fields are present
                if (!items || !deliveryDate || !deliveryFee || !serviceFee || !tax) {
                    throw new Error("Order details are incomplete. Cannot place the order.");
                }
    
                if (updatedBalance >= total) {
                    const formattedItems = items.map((item) => ({
                        product_id: item.id,
                        quantity: item.quantity,
                        unit_price: item.price,
                    }));
    
                    const placeOrderPayload = {
                        items: formattedItems,
                        deliveryDate,
                        deliveryFee: parseFloat(deliveryFee).toFixed(2),
                        serviceFee: parseFloat(serviceFee).toFixed(2),
                        tax: parseFloat(tax).toFixed(2),
                        userId: user.user_id,
                        householdId,
                    };
                    
    
                    console.log("Placing Order with Payload:", placeOrderPayload);
    
                    const placeOrderResponse = await fetch("http://localhost:5000/api/place-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(placeOrderPayload),
                    });
                    
                    const placeOrderData = await placeOrderResponse.json();
                    console.log(placeOrderData);
                    if (!placeOrderResponse.ok) {
                        throw new Error(placeOrderData.error || "Failed to place order.");
                    }
    
                    console.log("Order placed successfully:", placeOrderData);
                    localStorage.removeItem("basket");
                    navigate("/main/order-success");
                } else {
                    console.warn("Insufficient balance to place the order.");
                    setTopUpMessage(
                        `Top-up successful! However, your balance is insufficient to place this order.`
                    );
                    await updateLocalStorageAfterTopUp(user.user_id);
                    navigate("/main/account", { replace: true });
                }
            } else {
                console.log("No order details provided. Redirecting to account page...");
                await updateLocalStorageAfterTopUp(user.user_id);
                navigate("/main/account", { replace: true });
            }
        } catch (error) {
            console.error("Top-up error or order placement error:", error);
            setTopUpError(error.message || "An error occurred during top-up or order placement.");
        } finally {
            setIsSubmitting(false);
        }
    };
    


    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 text-blue-500 hover:underline"
                >
                    &larr; Go Back
                </button>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Up Your Account</h2>
                {location.state?.message && (
                    <p className="text-yellow-500 mb-4">{location.state.message}</p>
                )}
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
