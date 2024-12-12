import fs from "fs"; 
import readlineSync from "readline-sync";
import dotenv from "dotenv";
import { ensureDatabaseAndSchema } from "./initDatabase.js";

// Define your port and .env file path
const port = process.env.PORT || 5000;
const envFilePath = ".env";

// Function to prompt for database credentials and write to .env file
async function envSetup() {
    const user = readlineSync.question("Enter your PostgreSQL username: ");
    const password = readlineSync.question("Enter your PostgreSQL password: ", { hideEchoBack: true });
    if (!password) {
        console.error("Password cannot be empty.");
        process.exit(1);
    }
    const host = readlineSync.question("Enter your PostgreSQL host (default: localhost): ", {
        defaultInput: "localhost",
    });
    const port = readlineSync.question("Enter your PostgreSQL port (default: 5432): ", {
        defaultInput: "5432",
    });
    const database = readlineSync.question("Enter your PostgreSQL database name (default: ssh): ", {
        defaultInput: "ssh",
    });

    const envContent = `
DB_USER=${user.trim()}
DB_PASSWORD=${password.trim()}
DB_HOST=${host.trim()}
DB_PORT=${port.trim()}
DB_NAME=${database.trim()}
`.trim();

    fs.writeFileSync(envFilePath, envContent);
    console.log(`.env file created at ${envFilePath}`);
}


// Function to load or recreate .env file
async function loadOrRecreateEnv() {
    try {
        if (!fs.existsSync(envFilePath)) {
            console.log(".env file not found. Creating a new one...");
            await envSetup();
        } else {
            console.log(".env file already exists. Using existing configuration...");
        }

        // Reload environment variables
        dotenv.config();

        // Debug loaded variables
        console.log("Loaded environment variables:", {
            DB_USER: process.env.DB_USER,
            DB_PASSWORD: process.env.DB_PASSWORD ? "******" : null,
            DB_HOST: process.env.DB_HOST,
            DB_PORT: process.env.DB_PORT,
            DB_NAME: process.env.DB_NAME,
        });

        console.log("Ensuring database and schema are set up...");
        await ensureDatabaseAndSchema(); // If this fails, credentials are likely incorrect
    } catch (error) {
        if (error.message.includes("password authentication failed")) {
            console.error("Invalid credentials detected. Re-entering setup...");
            if (fs.existsSync(envFilePath)) {
                fs.unlinkSync(envFilePath); // Delete the incorrect .env file
                console.log(".env file deleted. Please re-enter your credentials.");
            }

            // Clear cached environment variables
            delete process.env.DB_USER;
            delete process.env.DB_PASSWORD;
            delete process.env.DB_HOST;
            delete process.env.DB_PORT;
            delete process.env.DB_NAME;

            await envSetup(); // Prompt for new credentials
            await loadOrRecreateEnv(); // Retry loading
        } else {
            throw error; // Re-throw other errors
        }
    }
}

let isShuttingDown = false; // Shutdown guard

async function shutdown(server, pool) {
    if (isShuttingDown) return; // Prevent multiple executions
    isShuttingDown = true;

    console.log("Shutting down server...");
    try {
        await pool.end();
        server.close(() => {
            console.log("Server and database connections closed.");
            process.exit(0);
        });
    } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
    }
}

(async () => {
    try {
        // Ensure that .env is ready and database is initialized before importing server.js
        await loadOrRecreateEnv();

        console.log("Database setup completed successfully. Starting the server...");

        // Now that .env is loaded, import server.js which uses environment variables
        const { app, checkAndPopulateDatabase, pool } = await import("./server.js");

        const server = app.listen(port, async () => {
            console.log(`Server running on http://localhost:${port}`);
            console.log("Ensuring database is initialized...");
            await checkAndPopulateDatabase();
        });

        // Handle server shutdown gracefully using process.once
        process.once("SIGTERM", () => shutdown(server, pool));
        process.once("SIGINT", () => shutdown(server, pool));
    } catch (error) {
        console.error("Database setup failed:", error.message);
        process.exit(1);
    }
})();
