import { app, pool, checkAndPopulateDatabase } from './server.js';
import { ensureDatabaseAndSchema } from './initDatabase.js';

const port = process.env.PORT || 5000;
let graceTimeout;

// Only start the server if not in test mode
let server;
if (process.env.NODE_ENV !== 'test') {
    server = app.listen(port, async () => {
        console.log(`Server running on http://localhost:${port}`);

        try {
            console.log("Ensuring database is initialized...");
            await ensureDatabaseAndSchema();
            console.log("Performing initial database population check...");
            await checkAndPopulateDatabase({}, {}, () => {});
        } catch (error) {
            console.error("Error during initial database population check:", error);
        }
    });

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}

async function shutdown() {
    console.log("Shutting down server...");
    if (graceTimeout) clearTimeout(graceTimeout);
    await pool.end();
    if (server) {
        server.close(() => {
            console.log("Server closed.");
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
}
