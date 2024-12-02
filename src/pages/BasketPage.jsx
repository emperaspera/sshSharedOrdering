import React, { useState } from "react";
import { useBasket } from "../context/BasketContext";
import { useNavigate } from "react-router-dom";
import supermarkets from "../supermarketData";

const BasketPage = () => {
    const {
        basket,
        updateQuantity,
        removeFromBasket,
        clearBasket,
        lastVisitedSupermarket,
        placeOrder, // New function from BasketContext
    } = useBasket();
    const navigate = useNavigate();
    const [deliveryDate, setDeliveryDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const BASE_DELIVERY_FEE = 5.0;
    const SERVICE_FEE = 2.5;

    const uniqueStoreIds = [...new Set(basket.map((item) => item.storeId))];
    const deliveryFee = BASE_DELIVERY_FEE * uniqueStoreIds.length;

    const groupedItems = basket.reduce((acc, item) => {
        if (!acc[item.storeId]) acc[item.storeId] = [];
        acc[item.storeId].push(item);
        return acc;
    }, {});

    const calculateSubtotal = () =>
        basket.reduce((total, item) => total + item.price * item.quantity, 0);

    const calculateTotal = () => calculateSubtotal() + deliveryFee + SERVICE_FEE;

    const handleCheckout = async () => {
        if (!deliveryDate || new Date(deliveryDate).getTime() < Date.now()) {
            alert("Please select a valid delivery date.");
            return;
        }

        setIsSubmitting(true); // Start submitting state

        // Retrieve user data from localStorage
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.user_id) {
            alert("User information is missing. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Fetch the user details from the database to get householdId
            const response = await fetch("http://localhost:5000/api/get-user-details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.user_id }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user details");
            }

            const userDetails = await response.json();
            const householdId = userDetails.household ? userDetails.household.household_id : null;

            if (!householdId) {
                alert("Household information is missing. Please try again or contact support.");
                setIsSubmitting(false);
                return;
            }

            // Prepare order data for saving in the database
            const orderDetails = {
                items: basket,
                total: calculateTotal(),
                deliveryDate,
                deliveryFee,
                serviceFee: SERVICE_FEE,
                householdId,
                userId: userDetails.user_id, // Use the retrieved user ID
            };

            // Place the order
            const success = await placeOrder(orderDetails);
            if (success) {
                alert("Order placed successfully!");
                clearBasket();
                navigate("/main/order-success");
            } else {
                alert("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("There was an error processing your order. Please try again.");
        }

        setIsSubmitting(false); // End submitting state
    };

    if (!basket.length) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
                <h1 className="text-3xl font-bold">Your Basket is Empty</h1>
                <button
                    onClick={() => navigate("/main")}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Back to Supermarket
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-bold mb-6">Your Basket</h1>
            {Object.entries(groupedItems).map(([storeId, items]) => {
                const store = supermarkets.find((s) => s.id === parseInt(storeId));
                return (
                    <div key={storeId} className="mb-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            {store?.name || "Unknown Store"}
                        </h2>
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center mb-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-md mr-4"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl">{item.name}</h3>
                                    <p>${item.price.toFixed(2)}</p>
                                    <div className="flex items-center mt-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="bg-gray-300 px-3 py-1 rounded"
                                        >
                                            -
                                        </button>
                                        <span className="px-4">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="bg-gray-300 px-3 py-1 rounded"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromBasket(item.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                );
            })}
            <div className="mt-6">
                <div className="text-xl">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Service Fee:</span>
                        <span>${SERVICE_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold mt-4 text-lg">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
                <div className="mt-6">
                    <label className="block text-gray-700 text-lg mb-2">
                        Select Delivery Date:
                    </label>
                    <input
                        type="date"
                        className="border rounded-lg px-3 py-2"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex mt-6 space-x-4">
                <button
                    onClick={() =>
                        navigate(lastVisitedSupermarket ? `/main/inventory/${lastVisitedSupermarket}` : "/main")
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Continue Shopping
                </button>
                <button
                    onClick={handleCheckout}
                    className={`bg-green-500 text-white px-4 py-2 rounded-lg ${
                        isSubmitting ? "opacity-50" : ""
                    }`}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Processing..." : "Pay"}
                </button>
            </div>
        </div>
    );
};

export default BasketPage;
