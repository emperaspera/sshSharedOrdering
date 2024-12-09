import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TableDeskLoginPage = () => {
    const [householdId, setHouseholdId] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleTableLogin = async (e) => {
        e.preventDefault(); // Prevent form submission reload
        setError(""); // Clear previous errors

        try {
            // Make API request to backend
            const response = await fetch("http://localhost:5000/api/table-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    householdId,
                    pin,
                }),
            });

            // Parse response JSON
            const data = await response.json();

            // Log response for debugging
            console.log("Response from backend:", data);

            // Handle non-OK responses
            if (!response.ok) {
                setError(data.error || "An error occurred");
                console.error("Login error:", data.error);
                return;
            }

            // Validate household data in response
            if (!data.household || !data.household.householdId) {
                setError("Household information is missing in the response.");
                return;
            }

            // Handle successful login
            alert("Login successful!");
            console.log("Login successful, navigating to Profile Selection Page...");

            // Store household details in localStorage for later use
            localStorage.setItem("household", JSON.stringify(data.household));
            localStorage.setItem("mode", "household");
            console.log("Current mode:", localStorage.getItem("mode")); // Debug log


            // Redirect to the Profile Selection Page
            navigate(`/household/select-profile?householdId=${householdId}`);
        } catch (err) {
            // Handle fetch or server errors
            console.error("Error during login request:", err);
            setError("Failed to login. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen bg-gray-100 flex items-center justify-center bg-gradient-to-r from-blue-800 to-purple-500">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Table Desk Login</h1>
                {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}
                <form onSubmit={handleTableLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2">Household ID</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={householdId}
                            onChange={(e) => setHouseholdId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">PIN</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition"
                    >
                        Login to Household
                    </button>
                </form>
                <div className="flex justify-between mt-4">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>
                    <button
                        className="text-gray-500 hover:underline"
                        onClick={() => navigate("/")}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableDeskLoginPage;
