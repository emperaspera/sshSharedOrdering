import fs from "fs";
import dotenv from "dotenv";
import { ensureDatabaseAndSchema } from "./initDatabase.js";

// Define the .env file path
const envFilePath = ".env";

// Function to write hardcoded database credentials to .env file
function writeDockerEnv() {
    const envContent = `
DB_USER=${process.env.DB_USER || "your_username"}
DB_PASSWORD=${process.env.DB_PASSWORD || "your_password"}
DB_HOST=${process.env.DB_HOST || "db"}
DB_PORT=${process.env.DB_PORT || "5432"}
DB_NAME=${process.env.DB_NAME || "ssh"}
`.trim();

    fs.writeFileSync(envFilePath, envContent);
    console.log(`Docker-specific .env file created at ${envFilePath}`);
}

async function main() {
    try {
        // Always write the Docker-specific .env file
        writeDockerEnv();
        dotenv.config();

        console.log("Loaded environment variables:", {
            DB_USER: process.env.DB_USER,
            DB_PASSWORD: process.env.DB_PASSWORD ? "******" : null,
            DB_HOST: process.env.DB_HOST,
            DB_PORT: process.env.DB_PORT,
            DB_NAME: process.env.DB_NAME,
        });

        console.log("Ensuring database and schema are set up...");
        await ensureDatabaseAndSchema();

        console.log("Database setup completed successfully. Starting the server...");

        // Import server.js and start the server
        const { app, checkAndPopulateDatabase, pool } = await import("./server.js");

        const server = app.listen(process.env.PORT || 5000, async () => {
            console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
            console.log("Ensuring database is initialized...");
            await checkAndPopulateDatabase();
        });

        process.once("SIGTERM", () => shutdown(server, pool));
        process.once("SIGINT", () => shutdown(server, pool));
    } catch (error) {
        console.error("Database setup failed:", error.message);
        process.exit(1);
    }
}

let isShuttingDown = false;

async function shutdown(server, pool) {
    if (isShuttingDown) return;
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

main();
