import React, { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';

const HamMenu = ({ isOpen, toggleMenu }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

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
        if (isClicked) return '#00008B'; // getting dark blue when clicked
        if (isHovered) return '#0000CD'; // also getting darker blue when its hovered
        return '#3B82F6'; // blue-500
    };

    return (
        <div className="relative lg:hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <button onClick={handleClick}>
                <RxHamburgerMenu size="30" color={getIconColor()} />
            </button>
            {(isOpen || isHovered) && (
                <div className="absolute top-5 right-0 bg-gray-100 shadow-lg w-60 max-w-screen" onClick={(e) => e.stopPropagation()}>
                    <ul className="p-4 text-allign-left justify-center">
                        <li className="py-2 text-gray-800 hover:text-blue-500" onClick={() => alert('Menu Item 1 clicked')}>Sign In</li>
                        <li className="py-2 text-gray-800 hover:text-blue-500" onClick={() => alert('Menu Item 2 clicked')}>Log Out</li>
                        <li className="py-2 text-gray-800 hover:text-blue-500" onClick={() => alert('Menu Item 3 clicked')}>Account Information</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

export default HamMenu;