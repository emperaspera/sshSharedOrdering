import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProfileSelectionPage = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const householdId = queryParams.get("householdId");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/household/${householdId}/users`);
                const data = await response.json();
                setUsers(data.users || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, [householdId]);

    const handleUserSelection = (user) => {
        setSelectedUser(user);
        setError("");
    };

    const handlePinVerification = async () => {
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/verify-user-pin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUser.user_id, pin }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Invalid PIN.");
                return;
            }

            // Store user and household details in localStorage
            const household = JSON.parse(localStorage.getItem("household"));
            localStorage.setItem("user", JSON.stringify({ ...selectedUser, household_id: household?.household_id }));

            // Redirect to main page
            navigate("/main");
        } catch (err) {
            setError("Failed to verify PIN. Please try again.");
        }


    };

    const handleGoBack = () => {
        localStorage.clear();
        navigate("/");
    }



    return (
        <div
            className="min-h-screen bg-gradient-to-r from-blue-600 to-green-500 flex flex-col items-center justify-center">
            {/* Profile Selection Card */}
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4 text-gray-800">Select a Profile</h1>
                {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}
                {users.length > 0 ? (
                    <ul className="mb-4">
                        {users.map((user) => (
                            <li
                                key={user.user_id}
                                className="py-2 px-4 border-b flex justify-between items-center hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleUserSelection(user)}
                            >
                                <span className="text-gray-800">{user.first_name} {user.last_name}</span>
                                <img
                                    src={user.profile_picture || "/profile-picture.jpg"} // Placeholder for missing pictures
                                    alt={`${user.first_name} ${user.last_name}`}
                                    className="w-10 h-10 rounded-full border border-gray-300"
                                />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        <p className="text-gray-500">No users found for this household.</p>
                        <button
                            className="text-gray-500 hover:underline"
                            onClick={handleGoBack}
                        >
                            Go Back
                        </button>
                    </>
                )}
                {selectedUser && (
                    <div>
                        <h3 className="text-lg font-bold mb-2 text-gray-800">
                            Enter PIN for {selectedUser.first_name}
                        </h3>
                        <input
                            type="text"
                            value={pin}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d{0,4}$/.test(value)) {
                                    setPin(value);
                                }
                            }}
                            className="border w-full px-4 py-2 rounded-lg mb-4"
                            placeholder="Enter PIN"
                            maxLength={4}
                            required
                        />
                        <button
                            onClick={handlePinVerification}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Verify PIN
                        </button>
                    </div>
                )}
            </div>

            {/* Go Back Button */}
            <button
                onClick={handleGoBack}
                className="mt-6 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:shadow-white transition-all duration-300"
            >
                Go Back
            </button>
        </div>
    );
};

export default ProfileSelectionPage;
