import React from 'react';

const Users = () => {
    return (
        <div className="text-blue-500 hidden md:flex items-center justify-center w-full pr-%50">
            <p> Hello User.name </p>    {/* To be writte, 1. (A function that gets the username)
                                                      2. (A style that only appers when logged in) */}
        </div>
    );
}

export default Users;