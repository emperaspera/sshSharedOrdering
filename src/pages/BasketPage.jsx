import { useState } from "react";
import { useBasket } from "../context/BasketContext";
import { useNavigate } from "react-router-dom";

const BasketPage = () => {
    const {
        basket,
        updateQuantity,
        removeFromBasket,
        clearBasket,
        lastVisitedSupermarket,
    } = useBasket();
    const navigate = useNavigate();
    const [deliveryDate, setDeliveryDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const BASE_DELIVERY_FEE = 5.0;
    const SERVICE_FEE = 2.5;

    const uniqueStoreIds = [...new Set(basket.map((item) => item.storeId))];
    const deliveryFee = BASE_DELIVERY_FEE * uniqueStoreIds.length;

    const calculateSubtotal = () =>
        basket.reduce((total, item) => total + item.price * item.quantity, 0);

    const calculateTax = () => parseFloat((calculateSubtotal() * 0.1).toFixed(2)); // 10% tax

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const tax = calculateTax();
        return subtotal + deliveryFee + SERVICE_FEE + tax;
    };

    const handleCheckout = async () => {
        if (!deliveryDate || new Date(deliveryDate).getTime() < Date.now()) {
            alert("Please select a valid delivery date.");
            return;
        }

        setIsSubmitting(true);

        const household = JSON.parse(localStorage.getItem("household"));
        const user = JSON.parse(localStorage.getItem("user"));
        const householdId = household?.householdId || user?.household_id || null;
        if (!user || !user.user_id) {
            alert("User information is missing. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        const grocerySubtotal = calculateSubtotal();
        const tax = calculateTax();
        const totalRequired = grocerySubtotal + deliveryFee + SERVICE_FEE + tax;

        try {
            const balanceResponse = await fetch(`http://localhost:5000/api/user-balance/${user.user_id}`);
            if (!balanceResponse.ok) {
                throw new Error("Failed to fetch user balance.");
            }
            const balanceData = await balanceResponse.json();
            let userBalance = parseFloat(balanceData.balance);

            if (isNaN(userBalance)) {
                userBalance = 0; // Handle invalid balance values
            }

            if (userBalance < totalRequired) {
                const shortfall = (totalRequired - userBalance).toFixed(2);

                alert(`Insufficient balance. You need an additional $${shortfall} to proceed.`);
                navigate("/top-up", {
                    state: {
                        prefilledAmount: shortfall,
                        orderDetails: {
                            items: basket,
                            total: calculateTotal(),
                            deliveryDate,
                            deliveryFee,
                            serviceFee: SERVICE_FEE,
                            tax,
                            userId: user.user_id,
                            householdId: householdId,
                        },
                    },
                });
                setIsSubmitting(false);
                return;
            }

            const payload = {
                items: basket.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                })),
                deliveryDate,
                deliveryFee,
                serviceFee: SERVICE_FEE,
                tax,
                userId: user.user_id,
                householdId: householdId,
                supermarketId: lastVisitedSupermarket,
            };

            const response = await fetch("http://localhost:5000/api/place-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Order placed successfully!");
                clearBasket();
                navigate("/main/order-success");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("There was an error processing your order. Please try again.");
        }

        setIsSubmitting(false);
    };

    if (!basket.length) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
                <h1 className="text-3xl font-bold">Your Basket is Empty</h1>
                <button
                    onClick={() => navigate("/main")}
                    className="mt-4 text-white bg-blue-500 px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition focus:ring-4 focus:ring-blue-300"
                >
                    Back to Supermarket
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Your Cart ({basket.length} items)</h1>
            <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
                <thead>
                    <tr className="bg-gray-200 text-gray-700">
                        <th className="text-left p-4">Item</th>
                        <th className="text-right p-4">Price</th>
                        <th className="text-center p-4">Quantity</th>
                        <th className="text-right p-4">Total</th>
                        <th className="text-center p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {basket.map((item) => (
                        <tr key={item.id} className="border-t">
                            <td className="p-4 flex items-center space-x-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    {item.estimatedDelivery && (
                                        <p className="text-sm text-orange-500">
                                            Estimated Ship Date: {item.estimatedDelivery}
                                        </p>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 text-right text-lg">${item.price.toFixed(2)}</td>
                            <td className="p-4 text-center">
                                <div className="inline-flex items-center border rounded">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-l"
                                    >
                                        -
                                    </button>
                                    <span className="px-4">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-r"
                                    >
                                        +
                                    </button>
                                </div>
                            </td>
                            <td className="p-4 text-right text-lg">
                                ${(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="p-4 text-center">
                                <button
                                    onClick={() => removeFromBasket(item.id)}
                                    className="text-white bg-red-500 px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition focus:ring-4 focus:ring-red-300"
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-8">
                <div className="text-lg mb-6">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Sales Tax (10%):</span>
                        <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Service Fee:</span>
                        <span>${SERVICE_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-xl">
                        <span>Grand Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 text-lg mb-2">Select Delivery Date:</label>
                    <input
                        type="date"
                        className="border rounded-lg px-3 py-2 w-full"
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
                    className="text-white bg-blue-500 px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition focus:ring-4 focus:ring-blue-300"
                >
                    Continue Shopping
                </button>
                <button
                    onClick={handleCheckout}
                    className={`text-white bg-green-500 px-6 py-2 rounded-lg shadow-md hover:bg-green-600 transition focus:ring-4 focus:ring-green-300 ${
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
