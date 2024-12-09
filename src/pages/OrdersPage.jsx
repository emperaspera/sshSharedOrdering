import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expandedOrderIds, setExpandedOrderIds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError("");

            try {
                const mode = localStorage.getItem("mode");
                const user = JSON.parse(localStorage.getItem("user"));
                const household = JSON.parse(localStorage.getItem("household"));

                const householdId = household?.householdId || null;
                const userId = user?.user_id || null;

                if (!householdId && !userId) {
                    alert("User information is missing. Please log in again.");
                    navigate("/login");
                    return;
                }

                const requestBody = mode === "household" ? { householdId } : { userId };
                const endpoint =
                    mode === "household"
                        ? "http://localhost:5000/api/household-orders"
                        : "http://localhost:5000/api/user-orders";

                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "An error occurred while fetching orders");
                    return;
                }

                console.log("Fetched orders:", data.orders);

                const taxRate = 0.1; // 10% tax
                const calculatedOrders = data.orders.map((order) => {
                    // Calculate total cost
                    const totalItemCost = order.users.reduce(
                        (sum, user) => sum + user.items.reduce((itemSum, item) => itemSum + item.subtotal, 0),
                        0
                    );
                    const totalCost = totalItemCost + (order.delivery_fee || 0) + (order.service_fee || 0);

                    console.log(`Order ID: ${order.order_id}, Total Item Cost: ${totalItemCost}, Total Cost: ${totalCost}`);

                    const taxFee = parseFloat((totalCost * taxRate).toFixed(2));

                    const updatedUsers = order.users.map((user) => {
                        const userSubtotal = user.items.reduce((sum, item) => sum + item.subtotal, 0);
                        const userTaxShare = userSubtotal / totalCost * taxFee;

                        console.log(`User ID: ${user.user_id}, Subtotal: ${userSubtotal}, Tax Share: ${userTaxShare}`);

                        return {
                            ...user,
                            tax_share: userTaxShare || 0,
                        };
                    });

                    return {
                        ...order,
                        total_cost: totalCost,
                        tax_fee: taxFee || 0,
                        users: updatedUsers,
                    };
                });

                console.log("Calculated orders with tax fees:", calculatedOrders);
                setOrders(calculatedOrders);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("There was an error fetching the orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderIds((prevExpanded) =>
            prevExpanded.includes(orderId)
                ? prevExpanded.filter((id) => id !== orderId)
                : [...prevExpanded, orderId]
        );
    };

    const navigationSource = localStorage.getItem("navigationSource");
    const goBackText = navigationSource === "account" ? "Go Back to Account" : "Go Back to Supermarkets";
    const goBackPath = navigationSource === "account" ? "/main/account" : "/main";

    const handleGoBack = () => {
        localStorage.removeItem("navigationSource");
        navigate(goBackPath);
    }
    // Retrieve mode for conditional rendering
    const mode = localStorage.getItem("mode"); // Retrieve mode as a string

    return (
        <div className="container mx-auto p-6">
            <button
                onClick={() => handleGoBack()}
                className="mb-6 text-blue-500 hover:underline"
            >
                &larr; {goBackText}
            </button>

            <h1 className="text-3xl font-bold mb-6">Orders</h1>
            {loading ? (
                <p>Loading orders...</p>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => {
                        const deliveryDateObj = new Date(order.delivery_date);
                        const deliveryDate = `${deliveryDateObj.getFullYear()}-${String(
                            deliveryDateObj.getMonth() + 1
                        ).padStart(2, "0")}-${String(deliveryDateObj.getDate()).padStart(2, "0")}`;

                        return (
                            <div
                                key={order.order_id}
                                className="border rounded-lg p-4 bg-gray-100 shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">
                                        Order ID: {order.order_id}
                                    </h2>
                                    <p className="text-gray-500">Delivery Date: {deliveryDate}</p>
                                </div>
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 text-blue-500 hover:underline mt-4"
                                    onClick={() => toggleOrderDetails(order.order_id)}
                                >
                                    <span>
                                        {expandedOrderIds.includes(order.order_id)
                                            ? "Hide order details"
                                            : "Show order details"}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 transform transition-transform ${
                                            expandedOrderIds.includes(order.order_id)
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {expandedOrderIds.includes(order.order_id) && (
                                    <div className="mt-4">
                                        <div className="border-t pt-4">
                                            {mode === "household" && (
                                                <h3 className="text-lg font-semibold">Users</h3>
                                            )}
                                            {order.users.map((user) => (
                                                <div
                                                    key={user.user_id}
                                                    className="bg-white p-4 rounded-md shadow-md mt-4"
                                                >
                                                    {mode === "household" && (
                                                        <h4 className="font-semibold text-gray-800">
                                                            {user.first_name} {user.last_name}
                                                        </h4>
                                                    )}
                                                    <ul className="mt-2 space-y-2">
                                                        {user.items.map((item) => (
                                                            <li
                                                                key={item.product_id}
                                                                className="flex justify-between"
                                                            >
                                                                <span>
                                                                    {item.quantity}x{" "}
                                                                    {item.product_name}
                                                                </span>
                                                                <span>
                                                                    $
                                                                    {parseFloat(
                                                                        item.unit_price
                                                                    ).toFixed(2)}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Delivery Fee Share:</span>
                                                        <span>
                                                            $
                                                            {user.delivery_fee_share
                                                                ? parseFloat(
                                                                    user.delivery_fee_share
                                                                ).toFixed(2)
                                                                : "0.00"}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Service Fee Share:</span>
                                                        <span>
                                                            $
                                                            {user.service_fee_share
                                                                ? parseFloat(
                                                                    user.service_fee_share
                                                                ).toFixed(2)
                                                                : "0.00"}
                                                        </span>
                                                    </div>

                                                    {mode === "household" && (
                                                        <p className="text-right text-lg font-bold mt-4">
                                                            Order Total (Including Tax): $
                                                            {(parseFloat(order.total_cost || 0) + parseFloat(order.tax_fee || 0)).toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-right text-lg font-bold mt-4">
                                            Order Total (Including Tax): $
                                            {(parseFloat(order.total_cost || 0) + parseFloat(order.tax_fee || 0)).toFixed(2)}
                                        </p>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Tax Fee:</span>
                                            <span>${parseFloat(order.tax_fee || 0).toFixed(2)}</span>
                                        </div>

                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;