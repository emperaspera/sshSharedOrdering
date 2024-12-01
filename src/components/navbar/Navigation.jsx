import React, { useState } from 'react';
import Logo from './Logo';
import HamMenu from './HamMenu';
import Users from './Users';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 flex items-center justify-between gap-3 md:gap-10
             px-5 md:px-20 h-20 bg-gray-100 text-slate-300 z-40 shadow-lg shadow-blue-500/30"> 
                <Logo />
                <Users />
                <HamMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
            <div className="h-20"></div> {/* this bug took me decades to figure out... */}
        </>
    );
}

export default Navigation;