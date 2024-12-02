import React from 'react';

const Logo = () => {
    return (
        <div className="flex items-center">
            <div className="bg-blue-500 px-7 p-2 rounded-full text-2xl md:text-3xl cursor-pointer flex items-center justify-center" style={{ height: '90px', width: '90px' }}>
                <span className="text-white" style={{ fontSize: '18px', WebkitTextStroke: '0.4px' }}>
                    SSH
                </span>
                <span className="text-sm text-white" style={{ fontSize: '14px', WebkitTextStroke: '0.3px' }}>
                    .App
                </span>
            </div>
        </div>
    );
}

export default Logo;