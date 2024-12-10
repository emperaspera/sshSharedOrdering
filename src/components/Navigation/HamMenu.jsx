import {useState} from 'react';
import {RxHamburgerMenu} from 'react-icons/rx';
import {useNavigate} from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const HamMenu = ({isOpen, toggleMenu}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = () => {
        toggleMenu();
        setIsClicked(!isClicked);
    };

    const getIconColor = () => {
        if (isClicked) return '#00008B'; // dark blue when clicked
        if (isHovered) return '#0000CD'; // darker blue when hovered
        return '#3B82F6'; // blue-500
    };

    // Check if the user is authorized (i.e., logged in)
    const isAuthorised = !!localStorage.getItem('user'); // Returns true if 'user' exists in localStorage

    // Logout function: Clear user data from localStorage and navigate to login page
    const handleLogout = () => {
        localStorage.removeItem('user');
        alert('You have been logged out.');
        navigate('/login');
    };

    return (
        <div
            className="relative lg:hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button onClick={handleClick}>
                <RxHamburgerMenu size="30" color={getIconColor()}/>
            </button>
            {(isOpen || isHovered) && (
                <div
                    className="absolute top-5 right-0 bg-gray-100 shadow-lg w-60 max-w-screen"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ul className="p-4 text-left">
                        {isAuthorised ? (
                            <>
                                <li
                                    className="py-2 text-gray-800 hover:text-blue-500"
                                    onClick={() => {
                                        toggleMenu();
                                        navigate("/main/account");
                                    }}
                                >
                                    Account Information
                                </li>
                                <li
                                    className="py-2 text-gray-800 hover:text-blue-500"
                                    onClick={() => {
                                        toggleMenu();
                                        navigate("/household/orders");
                                    }}
                                >
                                    Orders
                                </li>
                                <li
                                    className="py-2 text-gray-800 hover:text-blue-500"
                                    onClick={() => {
                                        handleLogout();
                                        toggleMenu();
                                    }}
                                >
                                    Log Out
                                </li>
                            </>
                        ) : (
                            <li
                                className="py-2 text-gray-800 hover:text-blue-500"
                                onClick={() => {
                                    toggleMenu();
                                    navigate("/signup");
                                }}
                            >
                                Sign In
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default HamMenu;