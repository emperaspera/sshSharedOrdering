import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "An error occurred");
                return;
            }

            // Store user data in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));

            // Determine mode based on household existence
            if (data.household && data.household.household_id) {
                localStorage.setItem("household", JSON.stringify(data.household));
                localStorage.setItem("mode", JSON.stringify(data.mode));
            } else {
                localStorage.setItem("mode", "user");
                localStorage.removeItem("household");
            }

            console.log("Mode set to:", localStorage.getItem("mode")); // Debugging

            // Redirect to main page
            navigate("/main");
        } catch (err) {
            console.error("Login error:", err); // Debugging
            setError("Failed to login. Please try again.");
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-800 to-green-500 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-lg w-96">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Login</h1>
                {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-600 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Login
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

export default LoginPage;
