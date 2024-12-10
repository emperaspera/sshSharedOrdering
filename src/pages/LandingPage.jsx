
import {useNavigate} from "react-router-dom";
import Navigation from "../components/Navigation/Navigation.jsx";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <Navigation/>
            <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center">
                {/* Gradient background section */}
                <div
                    className="w-full max-w-[768px] bg-gradient-to-r from-blue-600 to-green-500 text-white py-12 px-8 rounded-lg shadow-lg flex flex-col items-center group">
                    <h1 className="text-[48px] font-bold leading-[48px] text-center tracking-tight mb-4">
                        Welcome to Groceries App!
                    </h1>
                    <p className="text-[24px] font-medium leading-[32px] text-center tracking-tight mb-8">
                        Manage your groceries efficiently.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => navigate("/login")}
                            className="h-12 w-64 bg-blue-500 text-white font-medium text-lg rounded-md hover:border hover:border-white hover:shadow-0_4px_8px_0_rgba(255,255,255,0.5) transition"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="h-12 w-64 bg-green-500 text-white font-medium text-lg rounded-md hover:border hover:border-white hover:shadow-0_4px_8px_0_rgba(255,255,255,0.5) transition"
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => navigate("/table-desk-login")}
                            className="h-12 w-64 bg-purple-500 text-white font-medium text-lg rounded-md hover:border hover:border-white hover:shadow-0_4px_8px_0_rgba(255,255,255,0.5) transition"
                        >
                            Table Desk Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
