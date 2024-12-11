import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

// PostgreSQL Pool Configuration
const pool = new Pool({
    user: process.env.DB_USER, // PostgreSQL username
    host: process.env.DB_HOST, // Hostname
    database: process.env.DB_NAME, // Database name
    password: process.env.DB_PASSWORD, // PostgreSQL password
    port: process.env.DB_PORT, // Default port
});

// Export the pool to be used in other parts of the application
export { pool };
