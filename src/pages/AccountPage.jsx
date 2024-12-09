import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AccountPage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [balance, setBalance] = useState(0);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    const [editMode, setEditMode] = useState(false); // For toggling name/email editing
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [alreadyRedirected, setAlreadyRedirected] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchUserDetails = async () => {
        setLoading(true);
        setError("");

        try {
            const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
            if (!userId) {
                navigate("/login"); // Redirect if no user ID is found
                return;
            }

            const userResponse = await fetch("http://localhost:5000/api/get-user-details", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const userData = await userResponse.json();
            if (!userResponse.ok) {
                setError(userData.error || "Failed to fetch user details");
                return;
            }

            // Check if user is blocked
            if (userData.is_blocked && !alreadyRedirected) {
                const amountToUnblock = Math.abs(userData.balance || 0);
                setAlreadyRedirected(true); // Prevent multiple navigations
                navigate("/top-up", {
                    state: {
                        message: "Your account is blocked due to a negative balance. Please top up to continue.",
                        prefilledAmount: amountToUnblock,
                    },
                });
                return; // Prevent setting state after navigation
            }

            setUser(userData);
            setBalance(Number(userData.balance));
            setUpdatedName(`${userData.first_name} ${userData.last_name}`);
            setUpdatedEmail(userData.email);
        } catch (err) {
            console.error("Error fetching user details:", err);
            setError("Failed to fetch user details. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUserDetails();
    }, [navigate]);

    useEffect(() => {
        console.log("Checking redirection condition for blocked user...");

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            console.warn("No user found, redirecting to login...");
            navigate("/login");
            return;
        }

        if (user.is_blocked && !localStorage.getItem("alreadyRedirected")) {
            const amountToUnblock = Math.abs(user.balance || 0);

            console.log("User is blocked, redirecting to Top-Up...");

            // Prevent multiple redirects by storing in localStorage
            localStorage.setItem("alreadyRedirected", "true");

            navigate("/top-up", {
                state: {
                    message: "Your account is blocked due to a negative balance. Please top up to continue.",
                    prefilledAmount: amountToUnblock,
                },
            });
        }
    }, [navigate]);








    useEffect(() => {
        if (location.state?.refreshBalance) {
            fetchUserDetails();
        }
    }, [location.state]);

    const handleNavigateToOrders = () => {
        localStorage.setItem("navigationSource", "account");
        navigate("/household/orders");
    };

    const handleNavigateToTopUp = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            console.error("No user found in localStorage. Cannot navigate to Top-Up Page.");
            return;
        }

        console.log("Navigating to Top-Up with defaultAmount: 10");
        navigate("/top-up", {
            state: { prefilledAmount: 10 }, // Pass necessary data
        });
    };


    const handleUpdate = async (field, value) => {
        // Check if the value has changed

        try {
            const user = JSON.parse(localStorage.getItem("user"));

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

            fetchUserDetails(); // Refresh user details after update
        } catch (error) {
            console.error("Error updating details:", error);
            alert(error.message || "An error occurred.");
        }
    };


    const handlePasswordChange = () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        handleUpdate("password", password);
    };

    const handlePinChange = () => {
        if (pin !== confirmPin) {
            alert("PINs do not match!");
            return;
        }
        if (!/^\d{4}$/.test(pin)) {
            alert("PIN must be exactly 4 digits.");
            return;
        }
        handleUpdate("pin", pin);
    };

    const handleSaveNameEmail = () => {
        const [firstName, ...lastName] = updatedName.split(" ");
        handleUpdate("first_name", firstName.trim());
        handleUpdate("last_name", lastName.join(" ").trim());
        handleUpdate("email", updatedEmail.trim());
        setEditMode(false);
    };

    if (loading) return <p>Loading account details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white">
            <button
                onClick={() => navigate("/main")}
                className="mb-6 text-white hover:underline"
            >
                &larr; Go Back
            </button>
            <h1 className="text-3xl font-bold mb-6">My Account</h1>

            {/* Profile Picture Section */}
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg flex items-center gap-6">
                <img
                    src="/public/profile-picture.jpg"
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-gray-200"
                />
                <div>
                    <button
                        className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-500 transition-all duration-300"
                        onClick={() => alert("Update Profile Picture functionality")}
                    >
                        Update Picture
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-purple-500 transition-all duration-300 ml-2"
                        onClick={() => alert("Delete Profile Picture functionality")}
                    >
                        Delete Picture
                    </button>
                </div>
            </div>

            {/* User Information Section */}
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg mt-6">
                <h2 className="text-xl font-semibold mb-4">User Information</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Name</label>
                    {editMode ? (
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    ) : (
                        <input
                            type="text"
                            value={updatedName}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                            readOnly
                        />
                    )}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    {editMode ? (
                        <input
                            type="email"
                            value={updatedEmail}
                            onChange={(e) => setUpdatedEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    ) : (
                        <input
                            type="email"
                            value={updatedEmail}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100"
                            readOnly
                        />
                    )}
                </div>
                {editMode ? (
                    <div className="mt-4">
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 mr-2"
                            onClick={handleSaveNameEmail}
                        >
                            Save
                        </button>
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                            onClick={() => setEditMode(false)}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 mt-4"
                        onClick={() => setEditMode(true)}
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Manage Account Section */}
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg mt-6">
                <h2 className="text-xl font-semibold mb-4">Manage Account</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">New Password</label>
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-500 transition-all duration-300 mt-4"
                        onClick={handlePasswordChange}
                    >
                        Update Password
                    </button>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">New PIN</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2"
                        placeholder="Enter new PIN (4 digits)"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                    />
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        placeholder="Confirm new PIN"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-500 transition-all duration-300 mt-4"
                        onClick={handlePinChange}
                    >
                        Update PIN
                    </button>
                </div>
            </div>

            {/* Account Balance & Orders Section */}
            <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg mt-6">
                <h2 className="text-xl font-semibold mb-4">Account Balance & Orders</h2>
                <p className="mb-4">
                    <strong>Current Balance:</strong> ${balance.toFixed(2)}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={handleNavigateToTopUp}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg transition relative overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                        <span className="relative z-10">Top Up</span>
                    </button>
                    <button
                        onClick={handleNavigateToOrders}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg transition relative overflow-hidden group"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out"></span>
                        <span className="relative z-10">View Orders</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
