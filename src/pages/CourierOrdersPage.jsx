import React, { useEffect, useState } from "react";

const CourierOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:5000/api/courier-orders");
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to load orders");
                setLoading(false);
                return;
            }

            setOrders(data.orders || []);
        } catch (err) {
            console.error("Error fetching courier orders:", err);
            setError("There was an error loading the orders.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCompleteDelivery = async (orderId) => {
        const confirm = window.confirm("Are you sure you want to confirm delivery for this order?");
        if (!confirm) return;

        try {
            const response = await fetch("http://localhost:5000/api/complete-delivery", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ orderId }),
            });

            const data = await response.json();
            if (!response.ok) {
                alert(data.error || "Failed to complete delivery.");
                return;
            }

            alert(data.message || "Delivery completed successfully!");
            // Refresh the orders list
            fetchOrders();
        } catch (error) {
            console.error("Error completing delivery:", error);
            alert("Error completing delivery. Please try again.");
        }
    };

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (orders.length === 0) {
        return <div>No pending delivery orders found.</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Pending Delivery Orders</h1>
            <div className="space-y-4">
                {orders.map((order) => {
                    const deliveryDate = new Date(order.delivery_date).toLocaleDateString();
                    return (
                        <div key={order.order_id} className="border p-4 rounded-lg bg-gray-100 shadow-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">Order #{order.order_id}</h2>
                                <p className="text-gray-600">Delivery Date: {deliveryDate}</p>
                            </div>
                            <p className="mb-2"><strong>Address:</strong> {order.address}</p>

                            {order.users.map((user) => (
                                <div key={user.user_id} className="mt-4 bg-white p-4 rounded-md shadow">
                                    <h3 className="text-lg font-semibold">{user.first_name} {user.last_name}</h3>
                                    <ul className="mt-2 list-disc ml-5">
                                        {user.items.map((item) => (
                                            <li key={item.product_id}>
                                                {item.quantity}x {item.product_name} - ${item.unit_price.toFixed(2)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}

                            <div className="mt-6">
                                <button
                                    onClick={() => handleCompleteDelivery(order.order_id)}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                >
                                    Confirm Delivery
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CourierOrdersPage;
