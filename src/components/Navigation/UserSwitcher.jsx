import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

const UserSwitcher = ({ householdId }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [householdUsers, setHouseholdUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        console.log("Household from localStorage:", householdId);

        const user = JSON.parse(localStorage.getItem("user"));
        console.log("User from localStorage:", user);

        if (!user || !user.user_id) {
            console.warn("No user data found or incomplete user details in localStorage.");
        } else {
            console.log("User ID:", user.user_id);
        }

        // Fetch users belonging to the household
        if (householdId) {
            fetch(`http://localhost:5000/api/household/${householdId}/users`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.users) {
                        setHouseholdUsers(data.users);
                    } else {
                        console.error("Invalid response format:", data);
                    }
                })
                .catch((err) =>
                    console.error("Error fetching household users:", err)
                );
        }
    }, [householdId]);



    const toggleProfileMenu = () => {
        console.log("Profile menu toggled:", !isProfileMenuOpen); // Debugging line
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleSwitchUser = (user) => {
        console.log("User selected:", user); // Debugging line
        setSelectedUser(user);
        setPin(""); // Reset PIN field
        setError(""); // Clear previous errors
        setIsProfileMenuOpen(false);
    };


    const verifyPinAndSwitch = async () => {
        setError("");
        try {
            const response = await fetch("http://localhost:5000/api/verify-user-pin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: selectedUser?.user_id, pin }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("PIN verification failed:", data); // Debugging line
                setError(data.error || "Invalid PIN.");
                return;
            }

            // Store the complete user details in localStorage and reload
            localStorage.setItem("user", JSON.stringify(data.user));
            alert(`Switched to user: ${selectedUser.first_name} ${selectedUser.last_name}`);
            window.location.reload();
        } catch (err) {
            console.error("Error verifying PIN:", err);
            setError("Failed to verify PIN. Please try again.");
        }
    };



    return (
        <div className="relative">
            {/* Profile icon */}
            <FaUserCircle
                size={30}
                className="cursor-pointer text-blue-500"
                onClick={toggleProfileMenu}
            />

            {/* Profile menu */}
            {isProfileMenuOpen && (
                <div className="absolute top-10 right-0 bg-white shadow-md rounded-lg p-4 w-64 z-10">
                    <h3 className="text-gray-700 font-bold mb-2">Switch User</h3>
                    <ul className="space-y-2">
                        {householdUsers.length > 0 ? (
                            householdUsers.map((user) => (
                                <li
                                    key={user.user_id}
                                    className="cursor-pointer text-gray-800 hover:text-blue-500"
                                    onClick={() => handleSwitchUser(user)}
                                >
                                    {user.first_name} {user.last_name}
                                </li>
                            ))
                        ) : (
                            <li className="text-gray-500">No users available.</li>
                        )}
                    </ul>
                </div>
            )}

            {/* PIN verification modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">
                            Enter PIN for {selectedUser.first_name}
                        </h3>
                        {error && <p className="text-red-500 mb-2">{error}</p>}
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="border w-full px-4 py-2 rounded-lg mb-4"
                            placeholder="Enter PIN"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={verifyPinAndSwitch}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Verify
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserSwitcher;
