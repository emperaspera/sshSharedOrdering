import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");
    const [householdId, setHouseholdId] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault(); // Prevent page reload
        console.log("Signup attempt:", { firstName, lastName, email, password, pin, householdId });

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    pin,
                    householdId,
                }),
            });

            const data = await response.json();
            console.log("Signup response:", data);

            if (response.ok) {
                // Successful registration
                alert("Registration successful! Please login.");
                navigate("/login");
            } else {
                alert(data.error || "Signup failed");
            }
        } catch (err) {
            console.error("Error during signup:", err);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-600 to-purple-500">

            <form
                onSubmit={handleSignup}
                className="bg-white p-6 rounded-lg shadow-md w-96"
            >
                <h1 className="text-2xl font-bold mb-4 text-black">Signup</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">PIN</label>
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
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Household ID</label>
                    <input
                        type="number"
                        value={householdId}
                        onChange={(e) => setHouseholdId(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Sign Up
                </button>
                <div className="flex justify-between mt-4">
                    <button
                        className="text-blue-500 hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                    <button
                        className="text-gray-500 hover:underline"
                        onClick={() => navigate("/")}
                    >
                        Go Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignupPage;
