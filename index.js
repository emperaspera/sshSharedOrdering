import { ensureDatabaseAndSchema } from './initDatabase.js';
import { app, pool, checkAndPopulateDatabase } from './server.js';
import readlineSync from "readline-sync";

const port = process.env.PORT || 5000;

// Inline function to dynamically get PostgreSQL credentials
async function getPostgresCredentials() {
    const user = readlineSync.question("Enter your PostgreSQL username: ");
    const password = readlineSync.question("Enter your PostgreSQL password: ", { hideEchoBack: true });
    if (!password) {
        console.error("Password cannot be empty.");
        process.exit(1);
    }
    const host = readlineSync.question("Enter your PostgreSQL host (default: localhost): ") || "localhost";
    const port = parseInt(readlineSync.question("Enter your PostgreSQL port (default: 5432): ")) || 5432;

    return { user, password, host, port };
}

(async () => {
    try {
        console.log("Prompting for PostgreSQL credentials...");
        const dbCredentials = await getPostgresCredentials(); // Dynamically get credentials

        console.log("Ensuring database and schema are set up...");
        await ensureDatabaseAndSchema(dbCredentials); // Set up the database schema

        console.log("Database setup completed successfully. Starting the server...");

        // Start the server only after database setup is complete
        const server = app.listen(port, async () => {
            console.log(`Server running on http://localhost:${port}`);

            console.log("Ensuring database is initialized...");
            await checkAndPopulateDatabase({}, {}, () => {}); // Populate the database
        });

        // Handle server shutdown gracefully
        process.on("SIGTERM", () => shutdown(server));
        process.on("SIGINT", () => shutdown(server));
    } catch (error) {
        console.error("Database setup failed:", error.message);
        process.exit(1); // Exit on failure
    }
})();

async function shutdown(server) {
    console.log("Shutting down server...");
    await pool.end();
    server.close(() => {
        console.log("Server and database connections closed.");
        process.exit(0);
    });
}
