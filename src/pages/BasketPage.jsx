import React, { useState } from "react";
import { useBasket } from "../context/BasketContext";
import { useNavigate } from "react-router-dom";
import supermarkets from "../supermarketData";
import Navigation from "../components/navbar/Navigation";

const BasketPage = () => {
    const {
        basket,
        updateQuantity,
        removeFromBasket,
        clearBasket,
        lastVisitedSupermarket, // Access the last visited supermarket
    } = useBasket();
    const navigate = useNavigate();
    const [deliveryDate, setDeliveryDate] = useState("");

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

    const handleCheckout = () => {
        if (!deliveryDate) {
            alert("Please select a delivery date.");
            return;
        }
        clearBasket();
        navigate("/main/order-success");
    };

    if (!basket.length) {
        return (
            <div>
                <Navigation />
                <div className="pt-16 min-h-screen bg-gray-100 p-6 flex flex-col items-center">
                    <h1 className="text-3xl font-bold">Your Basket is Empty</h1>
                    <button
                        onClick={() => {
                            console.log("Navigating to /main");
                            navigate("/main");
                        }}
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Back to Supermarket
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navigation />
            <div className="pt-16 min-h-screen bg-gray-100 p-6">
                <h1 className="justify-center text-4xl font-bold mb-6">Your Basket</h1>
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
                                        <p className="text-gray-600">{item.description}</p>
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.storeId, item.quantity - 1)}
                                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l"
                                            >
                                                -
                                            </button>
                                            <span className="px-4">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.storeId, item.quantity + 1)}
                                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeFromBasket(item.id, item.storeId)}
                                            className="mt-2 text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <div className="text-lg font-bold text-gray-800">${item.price}</div>
                                </div>
                            ))}
                        </div>
                    );
                })}
                <div className="border-t border-gray-300 pt-4">
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
                <div className="flex mt-6 space-x-4">
                    <button
                        onClick={() =>
                            navigate(lastVisitedSupermarket ? `/main/inventory/${lastVisitedSupermarket}` : "/main")
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Continue shopping
                    </button>
                    <button
                        onClick={handleCheckout}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                        Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BasketPage;