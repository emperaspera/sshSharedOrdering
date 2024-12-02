import fetch from "node-fetch"; // Import the fetch function from node-fetch

const testLogin = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "john.doe@example.com",
                password: "12345678",
            }),
        });
        const data = await response.json();
        console.log("Login Test:", data);
    } catch (err) {
        console.error("Error during login test:", err);
    }
};

const testRegister = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firstName: "Jane",
                lastName: "Doe",
                email: "jane.doe@example.com",
                password: "password123",
                pin: "5678",
            }),
        });
        const data = await response.json();
        console.log("Register Test:", data);
    } catch (err) {
        console.error("Error during register test:", err);
    }
};

// Run the tests
testLogin();
testRegister();
