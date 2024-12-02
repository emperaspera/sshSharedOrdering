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



{/*
import React from 'react';
import { getSurname } from '../../userData'; // Adjust the path as necessary

const Users = () => {
    const surname = getSurname(); // Assuming this function returns the surname
    const isLoggedIn = true; // Emil you should do this , we need something that checks if the user is logged in and returns who is logged in from database

    return (
        isLoggedIn && (
            <div className="text-blue-500 hidden md:flex items-center justify-center w-full pr-50%">
                <p>Hello {surname}</p>
            </div>
        )
    );
}

export default Users;

*/}
