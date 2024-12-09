import pg from "pg";
import bcrypt from "bcrypt";

const { Client } = pg;

// Define Database Credentials in One Place
const DB_CONFIG = {
    user: "postgres", // PostgreSQL username
    host: "localhost", // Hostname
    password: "your password", // PostgreSQL password (change here only)
    port: 5432, // Default port
    defaultDatabase: "postgres", // Default "postgres" database
    targetDatabase: "ssh", // Target database
};

async function ensureDatabaseAndSchema() {
    const client = new Client({
        ...DB_CONFIG,
        database: DB_CONFIG.defaultDatabase, // Connect to the default "postgres" database
    });

    try {
        console.log("Checking if database exists...");
        await client.connect();

        // Check if the target database exists
        const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
        const dbResult = await client.query(checkDbQuery, [DB_CONFIG.targetDatabase]);

        if (dbResult.rows.length === 0) {
            console.log(`Database "${DB_CONFIG.targetDatabase}" does not exist. Creating...`);
            await client.query(`CREATE DATABASE ${DB_CONFIG.targetDatabase}`);
            console.log(`Database "${DB_CONFIG.targetDatabase}" created successfully.`);
        } else {
            console.log(`Database "${DB_CONFIG.targetDatabase}" already exists.`);
        }

        // Now initialize the schema in the target database
        await initializeSchema();

    } catch (error) {
        console.error("Error ensuring database and schema:", error.message);
    } finally {
        await client.end();
    }
}

async function initializeSchema() {
    const client = new Client({
        ...DB_CONFIG,
        database: DB_CONFIG.targetDatabase, // Connect to the target database
    });

    try {
        console.log(`Initializing schema for database "${DB_CONFIG.targetDatabase}"...`);
        await client.connect();

        const schemaQueries = [
            `CREATE TABLE IF NOT EXISTS households (
                household_id SERIAL PRIMARY KEY,
                address TEXT NOT NULL,
                pin_password TEXT NOT NULL,
                coordinate_x INT NOT NULL,
                coordinate_y INT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS users (
                user_id SERIAL PRIMARY KEY,
                household_id INT REFERENCES households(household_id) ON DELETE CASCADE,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                pin_password TEXT,
                phone_number VARCHAR(15),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_blocked BOOLEAN DEFAULT FALSE,
                balance NUMERIC(10, 2) DEFAULT 0
            )`,
            `CREATE TABLE IF NOT EXISTS supermarkets (
                supermarket_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                rating NUMERIC(3, 2),
                image_url TEXT,
                address TEXT,
                coordinate_x INT NOT NULL,
                coordinate_y INT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS categories (
                category_id SERIAL PRIMARY KEY,
                supermarket_id INT REFERENCES supermarkets(supermarket_id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                UNIQUE (supermarket_id, name)
            )`,
            `CREATE TABLE IF NOT EXISTS products (
                product_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                price NUMERIC(10, 2) NOT NULL,
                category VARCHAR(50),
                image_url TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS orders (
                order_id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
                household_id INT REFERENCES households(household_id) ON DELETE CASCADE,
                is_shared BOOLEAN DEFAULT FALSE,
                total_cost NUMERIC(10, 2),
                delivery_fee NUMERIC(10, 2),
                service_fee NUMERIC(10, 2),
                status VARCHAR(20) DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                delivery_date DATE NOT NULL,
                tax numeric(10,2) DEFAULT 0
            )`,
            `CREATE TABLE IF NOT EXISTS order_items (
                item_id SERIAL PRIMARY KEY,
                order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
                product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
                user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
                quantity INT NOT NULL,
                unit_price NUMERIC(10, 2) NOT NULL,
                subtotal NUMERIC(10, 2) NOT NULL,
                delivery_fee_share NUMERIC(10, 2),
                service_fee_share NUMERIC(10, 2),
                user_total NUMERIC(10, 2),
                tax_share NUMERIC(10, 2) DEFAULT 0
            )`,
            `CREATE TABLE IF NOT EXISTS payments (
                payment_id SERIAL PRIMARY KEY,
                order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
                user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
                amount NUMERIC(10, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'Pending',
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
        ];

        for (const query of schemaQueries) {
            await client.query(query);
        }

        console.log(`Schema initialized successfully for database "${DB_CONFIG.targetDatabase}".`);
        await populateHouseholds(client); // Populate with test data
    } catch (error) {
        console.error("Error initializing schema:", error.message);
    } finally {
        await client.end();
    }
}

async function populateHouseholds(client) {
    try {
        console.log("Populating test data for households...");

        const testHouseholds = [
            { address: "123 Pavel St", pin: "1111", coordinate_x: 3, coordinate_y: 8 },
            { address: "456 Emil St", pin: "2222", coordinate_x: 7, coordinate_y: 12 },
            { address: "789 Mert St", pin: "3333", coordinate_x: 10, coordinate_y: 6 },
        ];

        for (const household of testHouseholds) {
            // Hash the PIN
            const hashedPin = await bcrypt.hash(household.pin, 10);

            await client.query(
                `INSERT INTO households (address, pin_password, coordinate_x, coordinate_y)
                VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
                [household.address, hashedPin, household.coordinate_x, household.coordinate_y]
            );
        }

        console.log("Test data for households populated successfully.");
    } catch (error) {
        console.error("Error populating households:", error.message);
    }
}


// Execute the script
ensureDatabaseAndSchema();