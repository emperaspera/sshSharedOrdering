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
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h1 className="text-2xl font-bold mb-4">Select a Profile</h1>
                {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}
                {users.length > 0 ? (
                    <ul className="mb-4">
                        {users.map((user) => (
                            <li
                                key={user.user_id}
                                className="py-2 px-4 border-b hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleUserSelection(user)}
                            >
                                {user.first_name} {user.last_name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        <p className="text-gray-500">No users found for this household.</p>
                        <button
                            className="text-gray-500 hover:underline"
                            onClick={() => handleGoBack()}
                        >
                            Go Back
                        </button>
                    </>
                )}
                {selectedUser && (
                    <div>
                        <h3 className="text-lg font-bold mb-2">
                            Enter PIN for {selectedUser.first_name}
                        </h3>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg mb-4"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
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
        </div>
    );
};

export default ProfileSelectionPage;
