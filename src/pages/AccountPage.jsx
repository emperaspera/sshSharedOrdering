import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            setError("");

            try {
                const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
                if (!userId) {
                    navigate("/login");
                    return;
                }

                const response = await fetch("http://localhost:5000/api/get-user-details", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId }),
                });

                const data = await response.json();
                if (!response.ok) {
                    setError(data.error || "Failed to fetch user details");
                    return;
                }

                setUser(data);
                setBalance(data.balance || 0);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError("Failed to fetch user details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [navigate]);

    const handleUpdate = async (field, value) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            // Validate PIN if the field being updated is "pin"
            if (field === "pin" && !/^\d{4}$/.test(value)) {
                alert("PIN must be exactly 4 digits.");
                return;
            }

            const response = await fetch("http://localhost:5000/api/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.user_id,
                    field,
                    value,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update.");
            }

            alert(`${field} updated successfully!`);
            window.location.reload();
        } catch (error) {
            console.error("Error updating details:", error);
            alert(error.message || "An error occurred.");
        }
    };


    const handleNavigateToOrders = () => {
        localStorage.setItem("navigationSource", "account");
        navigate("/household/orders");
    };

    if (loading) return <p>Loading account details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="container mx-auto p-6">
            <button
                onClick={() => navigate("/main")}
                className="mb-6 text-blue-500 hover:underline"
            >
                &larr; Go Back
            </button>
            <h1 className="text-3xl font-bold mb-6">My Account</h1>
            <div className="bg-white p-4 rounded shadow">
                <h2 className="text-2xl mb-4">User Information</h2>
                <p>
                    <strong>Name:</strong> {user.first_name} {user.last_name}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Balance:</strong> ${balance.toFixed(2)}
                </p>
                <button
                    onClick={handleNavigateToOrders}
                    className="text-blue-500 hover:underline mt-4"
                >
                    View Orders
                </button>
            </div>
            <div className="bg-white p-4 rounded shadow mt-6">
                <h2 className="text-2xl mb-4">Update Credentials</h2>
                <button
                    className="text-blue-500 hover:underline"
                    onClick={() => {
                        const newPassword = prompt("Enter new password:");
                        if (newPassword) handleUpdate("password", newPassword);
                    }}
                >
                    Change Password
                </button>
                <br/>
                <button
                    className="text-blue-500 hover:underline mt-2"
                    onClick={() => {
                        const newPin = prompt("Enter new PIN:");
                        if (newPin) handleUpdate("pin", newPin);
                    }}
                >
                    Change PIN
                </button>
                <br/>
                <button
                    className="text-blue-500 hover:underline mt-2"
                    onClick={() => {
                        const newEmail = prompt("Enter new email:");
                        if (newEmail) handleUpdate("email", newEmail);
                    }}
                >
                    Change Email
                </button>
            </div>
        </div>
    );
};

export default AccountPage;
