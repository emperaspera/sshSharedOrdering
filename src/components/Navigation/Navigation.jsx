import {useEffect, useState} from "react";
import {Link} from "react-router-dom"; // Import Link from React Router
import Logo from "./Logo.jsx";
import Users from "./Users.jsx";
import HamMenu from "./HamMenu.jsx";
import UserSwitcher from "./UserSwitcher.jsx";
import LogoutButton from "./LogoutButton.jsx";

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [, setUser] = useState(null);
    const [household, setHousehold] = useState(null);

    useEffect(() => {
        // Load mode, user, and household from localStorage
        const storedMode = localStorage.getItem("mode");
        const storedUser = localStorage.getItem("user");
        const storedHousehold = localStorage.getItem("household");

        setMode(storedMode); // Set mode as 'user' or 'household'
        setUser(storedUser ? JSON.parse(storedUser) : null); // Parse user
        setHousehold(storedHousehold ? JSON.parse(storedHousehold) : null); // Parse household
    }, []);

    const householdId = household?.householdId || null; // Get householdId if available

    return (
        <>
            <div
                className="fixed top-0 left-0 right-0 flex items-center justify-between gap-3 md:gap-10
                px-5 md:px-20 h-20 bg-gray-100 text-slate-300 z-40 shadow-lg shadow-blue-500/30"
            >
                <Logo/>
                <Users/>
                <HamMenu isOpen={isMenuOpen} toggleMenu={() => setIsMenuOpen(!isMenuOpen)}/>
                <div className="hidden lg:flex items-center space-x-4">
                    {mode && (
                        <Link to="/main/account" className="hover:underline text-blue-500">
                            View Profile
                        </Link>
                    )}
                    {/* Add link to orders page if in "household" or "user" mode */}
                    {mode && (
                        <Link to="/household/orders" className="hover:underline text-blue-500">
                            View Orders
                        </Link>
                    )}

                    {/* Show UserSwitcher only if in "household" mode */}
                    {mode === "household" && householdId && <UserSwitcher householdId={householdId}/>}

                    {/* Show LogoutButton if in either "user" or "household" mode */}
                    {mode && <LogoutButton/>}
                </div>
            </div>

            {/* Add space below the navigation for logged-in users */}
            {mode && <div className="h-20"></div>}
        </>
    );
};

export default Navigation;