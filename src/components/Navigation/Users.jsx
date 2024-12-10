import { useEffect, useState } from "react";

const Users = () => {
    const [greeting, setGreeting] = useState(""); // Holds the greeting message
    const [currentUser, setCurrentUser] = useState(""); // Holds the current user info

    useEffect(() => {
        // Fetch household and user data from localStorage
        const mode = localStorage.getItem("mode");
        const household = JSON.parse(localStorage.getItem("household"));
        const user = JSON.parse(localStorage.getItem("user"));

        console.log("Mode from localStorage:", mode);
        console.log("Household from localStorage:", household);
        console.log("User from localStorage:", user);

        // Set greeting based on household
        if (mode === "household" && household?.address) {
            setGreeting(`Welcome, residents of Household: ${household.address}`);
            if (user?.first_name && user?.last_name) {
                setCurrentUser(`${user.first_name} ${user.last_name}`);
            } else {
                console.warn("No user data found or incomplete user details in localStorage.");
            }
        } else {
            setGreeting(""); // Hide greeting in "user" mode or when household data is unavailable
        }

        // Set current user based on user data
        if (user?.first_name && user?.last_name) {
            setGreeting(`Welcome, ${user?.first_name}  ${user?.last_name}`);
        } else {
            console.warn("No user data found or incomplete user details in localStorage.");
        }
    }, []); // Runs once when the component is mounted

    // If no household or user data is available, hide the component
    if (!greeting && !currentUser) {
        return null;
    }

    return (
        <div className="text-blue-500 hidden md:flex flex-col items-center justify-center w-full pr-10">
            {greeting && <p>{greeting}</p>}
            {currentUser && (
                <p className="text-sm text-gray-600">Current User: {currentUser}</p>
            )}
        </div>
    );
};

export default Users;