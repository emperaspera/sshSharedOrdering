import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

let pool; // Declare the pool variable

const initializePool = (dbCredentials) => {
    if (!pool) {
        pool = new Pool({
            ...dbCredentials,
            database: dbCredentials.database || process.env.DB_NAME, // Use dynamic or .env value
        });
    }
    return pool;
};

// Default pool initialization using environment variables
if (!pool) {
    pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });
}

export { pool, initializePool };
