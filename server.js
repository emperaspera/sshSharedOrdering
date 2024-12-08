import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import supermarkets from "./src/supermarketData.js"; // OUR VIRTUAL API WHICH POPULATED DATABASE

dotenv.config();
const { Pool } = pg;
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// PostgreSQL Pool Configuration
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ssh",
    password:"your password",
    port: 5432
});

async function populateDatabase() {
    const client = await pool.connect();
    try {
        console.log("Populating database with supermarket data...");
        await client.query("BEGIN");

        // Insert Supermarkets
        for (const supermarket of supermarkets) {
            const insertSupermarketQuery = `
                INSERT INTO supermarkets (supermarket_id, name, image_url, rating, description, coordinate_x, coordinate_y)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (supermarket_id) DO NOTHING;
            `;
            await client.query(insertSupermarketQuery, [
                supermarket.id,
                supermarket.name,
                supermarket.image,
                supermarket.rating,
                supermarket.description,
                supermarket.coordinate_x,
                supermarket.coordinate_y,
            ]);

            // Insert Categories
            for (const category of supermarket.categories) {
                const insertCategoryQuery = `
                    INSERT INTO categories (supermarket_id, name)
                    VALUES ($1, $2)
                    ON CONFLICT (supermarket_id, name) DO NOTHING;
                `;
                await client.query(insertCategoryQuery, [
                    supermarket.id,
                    category.name,
                ]);

                // Get the category_id just inserted or existing to link products
                const selectCategoryQuery = `
                    SELECT category_id 
                    FROM categories
                    WHERE supermarket_id = $1 AND name = $2;
                `;
                const categoryResult = await client.query(selectCategoryQuery, [
                    supermarket.id,
                    category.name,
                ]);
                const categoryId = categoryResult.rows[0].category_id;

                // Insert Items
                for (const item of category.items) {
                    const insertItemQuery = `
                        INSERT INTO products (product_id, name, description, price, image_url, category, updated_at)
                        VALUES ($1, $2, $3, $4, $5, $6, NOW())
                        ON CONFLICT (product_id) DO NOTHING;
                    `;
                    await client.query(insertItemQuery, [
                        item.id,
                        item.name,
                        item.description,
                        item.price,
                        item.image,
                        categoryId, // Updated to use category_id instead of just category name
                    ]);
                }
            }
        }

        await client.query("COMMIT");
        console.log("Database populated successfully!");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error populating database:", error);
    } finally {
        client.release();
    }
}

// 1. Login Endpoint
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Check if the user exists
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = result.rows[0];

        // Compare the entered password with the stored hashed password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Fetch the household information if available
        let household = null;
        if (user.household_id) {
            const householdResult = await pool.query(
                "SELECT household_id, address, coordinate_x, coordinate_y FROM households WHERE household_id = $1",
                [user.household_id]
            );
            household = householdResult.rows[0];
        }

        // Respond with user and household data (ensure complete user data is sent)
        res.status(200).json({
            message: "Login successful",
            mode: "user",
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                household_id: user.household_id,
            },
            household,
        });
    } catch (err) {
        console.error("Error during user login:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 2. Registration Endpoint
app.post("/api/register", async (req, res) => {
    const { firstName, lastName, email, password, pin, householdId } = req.body;

    if (!firstName || !lastName || !email || !password || !pin || !householdId) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ error: "PIN must be exactly 4 digits." });
    }

    try {
        // Check if the email is already registered
        const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Check if the household exists
        const householdCheck = await pool.query("SELECT * FROM households WHERE household_id = $1", [householdId]);
        if (householdCheck.rows.length === 0) {
            return res.status(400).json({ error: "Invalid Household ID" });
        }

        // Hash the password and PIN
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPin = await bcrypt.hash(pin, 10);

        // Insert the new user into the database
        await pool.query(
            "INSERT INTO users (household_id, first_name, last_name, email, password_hash, pin_password) VALUES ($1, $2, $3, $4, $5, $6)",
            [householdId, firstName, lastName, email, hashedPassword, hashedPin]
        );

        res.status(201).json({ message: "Registration successful" });
    } catch (err) {
        console.error("Error during user registration:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 3. Table Desk Login Endpoint
app.post("/api/table-login", async (req, res) => {
    const { householdId, pin } = req.body; // Get householdId and pin from the request body

    if (!householdId || !pin) {
        return res.status(400).json({ error: "Household ID and PIN are required" });
    }

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ error: "PIN must be exactly 4 digits." });
    }

    try {
        // Fetch the household and its hashed PIN
        const result = await pool.query(
            "SELECT household_id, pin_password, address FROM households WHERE household_id = $1",
            [householdId]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Household not found" });
        }

        const { household_id, pin_password, address } = result.rows[0];

        // Compare the entered PIN with the stored hashed PIN
        const isPinValid = await bcrypt.compare(pin, pin_password);
        if (!isPinValid) {
            return res.status(400).json({ error: "Invalid PIN" });
        }

        // If the PIN is valid, return success with the household details
        res.status(200).json({
            message: "Login successful",
            mode: "household",
            household: { householdId: household_id, address },
        });
    } catch (err) {
        console.error("Error during table login:", err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/update", async (req, res) => {
    const { userId, field, value } = req.body;

    // Validate request payload
    if (!userId || !field || !value) {
        return res.status(400).json({ error: "Invalid request data." });
    }

    try {
        let query, params;

        if (field === "pin") {
            // Enforce 4-digit PIN validation
            if (!/^\d{4}$/.test(value)) {
                return res.status(400).json({ error: "PIN must be exactly 4 digits." });
            }

            const hashedPin = await bcrypt.hash(value, 10); // Hash the new PIN
            query = "UPDATE users SET pin_password = $1 WHERE user_id = $2";
            params = [hashedPin, userId];
        } else if (field === "email") {
            query = "UPDATE users SET email = $1 WHERE user_id = $2";
            params = [value, userId];
        } else if (field === "password") {
            const hashedPassword = await bcrypt.hash(value, 10); // Hash the new password
            query = "UPDATE users SET password_hash = $1 WHERE user_id = $2";
            params = [hashedPassword, userId];
        } else {
            return res.status(400).json({ error: "Invalid field to update." });
        }

        // Execute the query
        await pool.query(query, params);

        res.json({ message: `${field} updated successfully.` });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});


app.get("/api/household/:householdId/users", async (req, res) => {
    const { householdId } = req.params;

    try {
        const result = await pool.query(
            "SELECT user_id, first_name, last_name FROM users WHERE household_id = $1",
            [householdId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No users found for this household." });
        }

        res.json({ users: result.rows });
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/user-orders", async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const result = await pool.query(
            `
            SELECT o.order_id, o.delivery_date, o.delivery_fee, o.service_fee, u.user_id, u.first_name, u.last_name, 
                   oi.product_id, oi.quantity, oi.unit_price, oi.subtotal, oi.delivery_fee_share, oi.service_fee_share, oi.user_total, p.name AS product_name
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN users u ON u.user_id = oi.user_id
            JOIN products p ON p.product_id = oi.product_id
            WHERE u.user_id = $1
            `,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        // Group orders by order_id to group items properly
        const ordersMap = {};

        result.rows.forEach((row) => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    order_id: row.order_id,
                    delivery_date: row.delivery_date,
                    delivery_fee: parseFloat(row.delivery_fee),
                    service_fee: parseFloat(row.service_fee),
                    users: {},
                };
            }

            if (!ordersMap[row.order_id].users[row.user_id]) {
                ordersMap[row.order_id].users[row.user_id] = {
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    items: [],
                    delivery_fee_share: parseFloat(row.delivery_fee_share),
                    service_fee_share: parseFloat(row.service_fee_share),
                    user_total: parseFloat(row.user_total),
                };
            }

            ordersMap[row.order_id].users[row.user_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                unit_price: parseFloat(row.unit_price),
                subtotal: parseFloat(row.subtotal),
            });
        });

        const orders = Object.values(ordersMap).map((order) => ({
            ...order,
            users: Object.values(order.users),
        }));

        res.json({ orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.post("/api/verify-user-pin", async (req, res) => {
    const { userId, pin } = req.body;

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({ error: "Invalid PIN. Must be exactly 4 digits." });
    }

    try {
        // Fetch the user by ID
        const result = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = result.rows[0];

        // Verify the PIN
        const isPinValid = await bcrypt.compare(pin, user.pin_password);
        if (!isPinValid) {
            return res.status(400).json({ error: "Invalid PIN" });
        }

        // Send success response with complete user details
        res.json({
            message: "PIN verified successfully",
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                household_id: user.household_id,
            },
        });
    } catch (err) {
        console.error("Error verifying PIN:", err);
        res.status(500).json({ error: "Server error" });
    }
});


// 4. Test Endpoint (Optional)
app.get("/api/test", (req, res) => {
    res.send("Server is running!");
});

app.post("/api/get-user-details", async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch household information if the user has one
        const user = result.rows[0];
        let household = null;

        if (user.household_id) {
            const householdResult = await pool.query(
                "SELECT * FROM households WHERE household_id = $1",
                [user.household_id]
            );
            household = householdResult.rows[0];
        }

        // Send back the user details including household info if available
        res.json({ ...user, household });
    } catch (error) {
        console.error("Error retrieving user details:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.post("/api/place-order", async (req, res) => {
    const { items, total, deliveryDate, deliveryFee, serviceFee, userId, householdId } = req.body;

    // Basic validation
    if (!items || !items.length || !deliveryDate) {
        console.error("Invalid order details:", { items, deliveryDate });
        return res.status(400).json({ error: "Invalid order details." });
    }

    const client = await pool.connect();
    try {
        console.log("Starting order placement...");
        console.log("Order details received:", { items, total, deliveryDate, deliveryFee, serviceFee, userId, householdId });

        await client.query("BEGIN");

        let orderId;

        if (householdId) {
            console.log("Checking if an existing order is present for household:", householdId);
            const existingOrderQuery = `
                SELECT order_id FROM orders 
                WHERE household_id = $1 AND delivery_date = $2
            `;
            const existingOrderResult = await client.query(existingOrderQuery, [householdId, deliveryDate]);

            if (existingOrderResult.rows.length > 0) {
                // Use the existing order ID
                orderId = existingOrderResult.rows[0].order_id;
                console.log("Existing order found with order_id:", orderId);
            }
        }

        // If no existing order, create a new one
        if (!orderId) {
            console.log("Creating a new order...");
            const orderResult = await client.query(
                `INSERT INTO orders (user_id, household_id, is_shared, total_cost, delivery_fee, service_fee, status, created_at, delivery_date) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8) RETURNING order_id`,
                [
                    userId || null,
                    householdId || null,
                    householdId ? true : false,
                    total,
                    deliveryFee,
                    serviceFee,
                    "Pending",
                    deliveryDate,
                ]
            );
            orderId = orderResult.rows[0].order_id;
            console.log("New order created with order_id:", orderId);
        }

        // Insert items into `order_items`
        console.log("Inserting items into order_items...");
        for (const item of items) {
            console.log("Inserting item:", item);
            await client.query(
                `INSERT INTO order_items (order_id, product_id, user_id, quantity, unit_price, subtotal) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    orderId,
                    item.id,
                    userId || null,
                    item.quantity,
                    item.price,
                    item.price * item.quantity,
                ]
            );
        }

        // Update the fees and user totals for the household
        if (householdId) {
            console.log("Updating fees and user totals for household...");
            const userCountQuery = `SELECT DISTINCT user_id FROM order_items WHERE order_id = $1`;
            const userCountResult = await client.query(userCountQuery, [orderId]);
            const userCount = userCountResult.rows.length;

            if (userCount > 0) {
                const updatedDeliveryFee = deliveryFee / userCount;
                const updatedServiceFee = serviceFee / userCount;

                // Update the order_items table with new fee shares and user totals
                for (const user of userCountResult.rows) {
                    console.log("Updating fees for user_id:", user.user_id);
                    const userItemsQuery = `
                        SELECT SUM(subtotal) AS user_total FROM order_items
                        WHERE order_id = $1 AND user_id = $2
                    `;
                    const userItemsResult = await client.query(userItemsQuery, [orderId, user.user_id]);
                    const userItemsTotal = parseFloat(userItemsResult.rows[0].user_total);

                    const updatedUserTotal = userItemsTotal + updatedDeliveryFee + updatedServiceFee;

                    // Update the user total, delivery fee, and service fee for each user in order_items
                    await client.query(
                        `UPDATE order_items 
                         SET delivery_fee_share = $1, service_fee_share = $2, user_total = $3
                         WHERE order_id = $4 AND user_id = $5`,
                        [updatedDeliveryFee, updatedServiceFee, updatedUserTotal, orderId, user.user_id]
                    );
                }
            }
        }

        await client.query("COMMIT");
        console.log("Order placed successfully with orderId:", orderId);
        res.status(200).json({ message: "Order placed successfully!", orderId });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error placing order:", error);
        res.status(500).json({ error: "Failed to place order.", details: error.message });
    } finally {
        client.release();
    }
});






app.post("/api/household-orders", async (req, res) => {
    const { householdId, deliveryDate } = req.body;

    try {
        let query = `
            SELECT o.order_id, o.delivery_date, o.delivery_fee, o.service_fee, u.user_id, u.first_name, u.last_name, 
                   oi.product_id, oi.quantity, oi.unit_price, oi.subtotal, oi.delivery_fee_share, oi.service_fee_share, oi.user_total, p.name AS product_name
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN users u ON u.user_id = oi.user_id
            JOIN products p ON p.product_id = oi.product_id
            WHERE o.household_id = $1
        `;
        let queryParams = [householdId];

        if (deliveryDate) {
            query += ` AND o.delivery_date = $2`;
            queryParams.push(deliveryDate);
        }

        const result = await pool.query(query, queryParams);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No orders found for this household." });
        }

        // Grouping the orders by order_id to combine users for the same delivery date
        const ordersMap = {};

        result.rows.forEach((row) => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    order_id: row.order_id,
                    delivery_date: row.delivery_date,
                    delivery_fee: parseFloat(row.delivery_fee),
                    service_fee: parseFloat(row.service_fee),
                    users: {},
                    total_cost: 0, // Initialize the total_cost
                };
            }

            if (!ordersMap[row.order_id].users[row.user_id]) {
                ordersMap[row.order_id].users[row.user_id] = {
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    items: [],
                    delivery_fee_share: parseFloat(row.delivery_fee_share),
                    service_fee_share: parseFloat(row.service_fee_share),
                    user_total: parseFloat(row.user_total),
                };
            }

            // Push each item to the corresponding user
            ordersMap[row.order_id].users[row.user_id].items.push({
                product_id: row.product_id,
                product_name: row.product_name,
                quantity: row.quantity,
                unit_price: parseFloat(row.unit_price),
                subtotal: parseFloat(row.subtotal),
            });

            // Accumulate the total cost of the order
            ordersMap[row.order_id].total_cost += parseFloat(row.subtotal);
        });

        // Calculate the total cost by adding the service and delivery fees
        const orders = Object.values(ordersMap).map((order) => ({
            ...order,
            total_cost: order.total_cost + order.delivery_fee + order.service_fee,
            users: Object.values(order.users),
        }));

        res.json({ orders });
    } catch (error) {
        console.error("Error fetching household orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



// Start the server
app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    await populateDatabase(); // Populate the database every time the server starts
});