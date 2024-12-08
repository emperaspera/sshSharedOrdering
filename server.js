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
// const pool = new Pool({
//     user: process.env.DB_USER, // PostgreSQL username
//     host: process.env.DB_HOST, // Hostname
//     database: process.env.DB_NAME,  // Database name
//     password: process.env.DB_PASSWORD, // PostgreSQL password
//     port: process.env.DB_PORT,       // Default port
// });

const pool = new Pool({
    user: "pavl",
    host: "localhost",
    database: "ssh",
    password:"Jktymrf9",
    port: 5432
});


async function populateDatabase() {
    const client = await pool.connect();
    try {
        console.log("Populating database with supermarket data...");
        await client.query("BEGIN");

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
                        categoryId,
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

let lastPopulationTime = null;
//let isPopulating = false; // Flag to track population in progress

// Middleware to check if the database needs to be repopulated
async function checkAndPopulateDatabase(req, res, next) {
    const now = new Date();
    const oneMinute = 24 * 60 * 60 * 1000; // 1 minute in milliseconds

    if (!lastPopulationTime || now - lastPopulationTime > oneMinute) {
        // Update lastPopulationTime immediately to prevent multiple requests from triggering
        lastPopulationTime = now;
        console.log(`[${now.toISOString()}] Starting database population...`);

        try {
            await populateDatabase(); // Populate database
            console.log(`[${new Date().toISOString()}] Database population completed.`);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error during database population:`, error);
        } finally {
            // Add a short grace period to avoid frequent repopulations
            setTimeout(() => {
                console.log(`[${new Date().toISOString()}] Grace period ended.`);
            }, 5000); // Grace period of 5 seconds
        }
    }

    if (next) next(); // Proceed to the next middleware or route handler
}

// Apply middleware globally
app.use(checkAndPopulateDatabase);

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

    if (!userId || !field || value === undefined) {
        return res.status(400).json({ error: "Invalid request data." });
    }

    try {
        let query, params;

        if (field === "first_name") {
            query = "UPDATE users SET first_name = $1 WHERE user_id = $2";
            params = [value, userId];
        } else if (field === "last_name") {
            query = "UPDATE users SET last_name = $1 WHERE user_id = $2";
            params = [value, userId];
        } else if (field === "email") {
            query = "UPDATE users SET email = $1 WHERE user_id = $2";
            params = [value, userId];
        } else if (field === "password") {
            const hashedPassword = await bcrypt.hash(value, 10); // Hash the new password
            query = "UPDATE users SET password_hash = $1 WHERE user_id = $2";
            params = [hashedPassword, userId];
        } else if (field === "pin") {
            const hashedPin = await bcrypt.hash(value, 10); // Hash the new PIN
            query = "UPDATE users SET pin_password = $1 WHERE user_id = $2";
            params = [hashedPin, userId];
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

// Top-up Balance
// server.js
app.post("/api/top-up", async (req, res) => {
    const { userId, amount, cardNumber } = req.body;

    // Basic Validation
    if (!userId || amount === undefined || !cardNumber) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    if (typeof amount !== "number") {
        return res.status(400).json({ error: "Amount must be a number." });
    }

    if (amount <= 0) {
        return res.status(400).json({ error: "Invalid amount." });
    }

    if (!/^\d{16}$/.test(cardNumber)) {
        return res.status(400).json({ error: "Invalid card number." });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Insert the payment into the `payments` table
        const insertPaymentQuery = `
            INSERT INTO payments (user_id, order_id, amount, status, transaction_date)
            VALUES ($1, NULL, $2, 'completed', NOW())
            RETURNING payment_id
        `;
        const paymentResult = await client.query(insertPaymentQuery, [userId, amount]);

        if (paymentResult.rows.length === 0) {
            throw new Error("Failed to record payment.");
        }

        const paymentId = paymentResult.rows[0].payment_id;

        // Update the user's balance in the `users` table
        const updateBalanceQuery = `
            UPDATE users
            SET balance = balance + $1
            WHERE user_id = $2
            RETURNING balance
        `;
        const balanceResult = await client.query(updateBalanceQuery, [amount, userId]);

        if (balanceResult.rows.length === 0) {
            throw new Error("Failed to update user balance.");
        }

        const updatedBalance = balanceResult.rows[0].balance;

        await client.query("COMMIT");

        res.status(200).json({
            message: "Top-up successful.",
            paymentId: paymentId,
            updatedBalance: updatedBalance,
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error during top-up:", error);
        res.status(500).json({ error: "Internal server error during top-up." });
    } finally {
        client.release();
    }
});




// app.post("/api/get-user-balance", async (req, res) => {
//     const { userId } = req.body;
//
//     try {
//         const result = await pool.query(
//             `SELECT COALESCE(SUM(amount), 0) AS balance
//              FROM payments
//              WHERE user_id = $1 AND status = 'completed'`,
//             [userId]
//         );
//
//         const balance = result.rows[0].balance;
//
//         res.status(200).json({ balance });
//     } catch (err) {
//         console.error("Error retrieving balance:", err);
//         res.status(500).json({ error: "Internal server error during balance retrieval." });
//     }
// });


app.get('/api/user-balance/:userId', async (req, res) => {
    const { userId } = req.params;

    console.log(`[USER BALANCE] Received request with userId: ${userId}`);

    try {
        // Query the user's balance from the database
        const userQuery = 'SELECT * FROM users WHERE user_id = $1';
        const result = await pool.query(userQuery, [userId]);

        if (result.rows.length === 0) {
            console.log(`[USER BALANCE] No user found with userId: ${userId}`);
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        console.log(`[USER BALANCE] Retrieved user data:`, user);

        // Ensure the balance field is parsed as a float
        const balance = parseFloat(user.balance) || 0;
        console.log(`[USER BALANCE] Parsed balance: ${balance}`);

        // Send the response
        res.json({ balance });
    } catch (error) {
        console.error(`[USER BALANCE] Error fetching balance for userId ${userId}:`, error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Deduct Payment




app.post("/api/deduct-payment", async (req, res) => {
    const { userId, orderId, amount } = req.body;

    if (!userId || typeof amount !== "number") {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const insertPaymentQuery = `
            INSERT INTO payments (user_id, order_id, amount, status, transaction_date)
            VALUES ($1, $2, $3, 'completed', NOW())
            RETURNING payment_id
        `;
        const paymentResult = await pool.query(insertPaymentQuery, [userId, orderId || null, amount]);

        if (paymentResult.rows.length === 0) {
            throw new Error("Failed to record payment.");
        }

        res.status(200).json({ message: "Payment deducted successfully.", paymentId: paymentResult.rows[0].payment_id });
    } catch (error) {
        console.error("Error deducting payment:", error);
        res.status(500).json({ error: "Internal server error during payment deduction." });
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

    console.log(`[GET USER DETAILS] Received request with userId: ${userId}`);

    if (!userId) {
        console.error(`[GET USER DETAILS] Error: Missing userId in request`);
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // Log query to fetch user details
        console.log(`[GET USER DETAILS] Querying user details for userId: ${userId}`);
        const userResult = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);

        if (userResult.rows.length === 0) {
            console.error(`[GET USER DETAILS] Error: User with userId ${userId} not found`);
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult.rows[0];
        console.log(`[GET USER DETAILS] Retrieved user: ${JSON.stringify(user)}`);

        // Log query to fetch balance
        console.log(`[GET USER DETAILS] Querying balance for userId: ${userId}`);

        const balance = parseFloat(user.balance) || 0;

        console.log(`[GET USER DETAILS] Retrieved balance: ${balance}`);

        // Log successful response
        console.log(`[GET USER DETAILS] Sending response for userId: ${userId}`);
        res.json({
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            balance,
        });
    } catch (error) {
        // Log unexpected errors
        console.error(`[GET USER DETAILS] Error while fetching user details:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});








// server.js
app.post("/api/place-order", async (req, res) => {
    const { items, deliveryDate, deliveryFee, serviceFee, tax, userId, householdId } = req.body;

    // Basic Validation
    if (!items || !items.length || !deliveryDate || !userId || !supermarketId) {
        return res.status(400).json({ error: "Invalid order details." });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Calculate totals
        const grocerySubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const amountToDeduct = grocerySubtotal + tax;
        const totalRequired = amountToDeduct + deliveryFee + serviceFee;

        let userBalance = 0;

        // Fetch individual user balance
        const userBalanceResult = await client.query(
            `SELECT balance FROM users WHERE user_id = $1`,
            [userId]
        );

        if (userBalanceResult.rows.length === 0) {
            throw new Error("User not found.");
        }

        userBalance = parseFloat(userBalanceResult.rows[0].balance);
        if (isNaN(userBalance)) {
            userBalance = 0;
        }

        console.log(`User Balance (ID: ${userId}): ${userBalance}`);
        console.log(`Grocery + Tax Amount: ${amountToDeduct}`);
        console.log(`Total Required (Including Fees): ${totalRequired}`);

        if (userBalance < amountToDeduct) {
            const shortfall = (amountToDeduct - userBalance).toFixed(2);
            await client.query("ROLLBACK");
            return res.status(400).json({
                error: "Insufficient balance",
                message: `You need an additional $${shortfall} to proceed.`,
                shortfall
            });
        }

        // Deduct groceries and tax from balance
        const deductionAmount = -amountToDeduct; // Negative value to indicate deduction
        await client.query(
            `UPDATE users
             SET balance = balance + $1
             WHERE user_id = $2
             RETURNING balance`,
            [deductionAmount, userId]
        );
        console.log(`Deducted amount: ${deductionAmount}`);

        const existingOrdersQuery = `
            SELECT DISTINCT o.order_id, COUNT(DISTINCT oi.user_id) AS user_count
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.product_id
            WHERE o.household_id = $1
              AND o.delivery_date = $2
              AND p.supermarket_id = $3
            GROUP BY o.order_id
        `;
        const existingOrdersResult = await client.query(existingOrdersQuery, [
            householdId,
            deliveryDate,
            supermarketId,
        ]);

        let sharedUserCount = 1; // Include the current user
        if (existingOrdersResult.rows.length > 0) {
            sharedUserCount += parseInt(existingOrdersResult.rows[0].user_count, 10);
        }

        const sharedDeliveryFee = parseFloat(deliveryFee) / sharedUserCount;
        const sharedServiceFee = parseFloat(serviceFee) / sharedUserCount;


        // Create the order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, household_id, is_shared, total_cost, delivery_fee, service_fee, tax, status, created_at, delivery_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', NOW(), $8) RETURNING order_id`,
            [
                userId,
                householdId || null,
                !!householdId,
                grocerySubtotal + tax,
                deliveryFee,
                serviceFee,
                tax,
                deliveryDate
            ]
        );
        const orderId = orderResult.rows[0].order_id;
        console.log(`Created order with ID: ${orderId}`);

        // Insert order items
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, user_id, quantity, unit_price, subtotal)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [orderId, item.id, userId, item.quantity, item.price, item.price * item.quantity]
            );
            console.log(`Inserted item ID: ${item.id}, Quantity: ${item.quantity}`);
        }

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
        console.log(`Order placed successfully with ID: ${orderId}`);
        return res.status(200).json({ message: "Order placed successfully!", orderId });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error placing order:", error);
        return res.status(500).json({ error: "Failed to place order." });
    } finally {
        client.release();
    }
});





app.get("/api/courier-orders", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT o.order_id, o.delivery_date, o.delivery_fee, o.service_fee, o.status,
                   h.address,
                   u.user_id, u.first_name, u.last_name,
                   oi.product_id, oi.quantity, oi.unit_price, oi.subtotal, p.name AS product_name
            FROM orders o
            JOIN households h ON o.household_id = h.household_id
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON p.product_id = oi.product_id
            JOIN users u ON u.user_id = oi.user_id
            WHERE o.status = 'Pending'
            ORDER BY o.order_id ASC;
        `);

        if (result.rows.length === 0) {
            return res.status(200).json({ orders: [] });
        }

        // Group by order_id
        const ordersMap = {};
        result.rows.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    order_id: row.order_id,
                    delivery_date: row.delivery_date,
                    delivery_fee: parseFloat(row.delivery_fee),
                    service_fee: parseFloat(row.service_fee),
                    status: row.status,
                    address: row.address,
                    users: {},
                };
            }

            if (!ordersMap[row.order_id].users[row.user_id]) {
                ordersMap[row.order_id].users[row.user_id] = {
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    items: [],
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

        const orders = Object.values(ordersMap).map(order => ({
            ...order,
            users: Object.values(order.users),
        }));

        res.json({ orders });
    } catch (error) {
        console.error("Error fetching courier orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.post("/api/complete-delivery", async (req, res) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ error: "Order ID is required." });
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Fetch order details, including userId
        const orderResult = await client.query(
            `SELECT user_id, delivery_fee, service_fee, status
             FROM orders WHERE order_id = $1 FOR UPDATE`,
            [orderId]
        );

        if (orderResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "Order not found." });
        }

        const { user_id: userId, delivery_fee, service_fee, status } = orderResult.rows[0];

        if (status !== "Pending") {
            await client.query("ROLLBACK");
            return res.status(400).json({ error: "Order not in a state to complete delivery." });
        }

        // Parse delivery_fee and service_fee as numbers
        const numericDeliveryFee = parseFloat(delivery_fee) || 0;
        const numericServiceFee = parseFloat(service_fee) || 0;
        const feesToDeduct = numericDeliveryFee + numericServiceFee;

        // Check if the user has sufficient balance
        const userBalanceResult = await client.query(
            `SELECT balance FROM users WHERE user_id = $1 FOR UPDATE`,
            [userId]
        );

        if (userBalanceResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ error: "User not found." });
        }

        let userBalance = parseFloat(userBalanceResult.rows[0].balance);
        if (isNaN(userBalance)) userBalance = 0;

        if (userBalance < feesToDeduct) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                error: "Insufficient balance",
                message: `You need an additional $${(feesToDeduct - userBalance).toFixed(2)} to cover delivery and service fees.`,
            });
        }

        // Deduct delivery and service fees from user balance
        const newBalance = userBalance - feesToDeduct;
        await client.query(
            `UPDATE users SET balance = $1 WHERE user_id = $2`,
            [newBalance, userId]
        );

        // Record the payment in the `payments` table
        await client.query(
            `INSERT INTO payments (user_id, order_id, amount, status, transaction_date)
             VALUES ($1, $2, $3, 'completed', NOW())`,
            [userId, orderId, -feesToDeduct]
        );

        // Update the order status to 'Completed'
        await client.query(
            `UPDATE orders SET status = 'Completed' WHERE order_id = $1`,
            [orderId]
        );

        await client.query("COMMIT");
        console.log(`Completed delivery for order ID: ${orderId}, Fees Deducted: ${feesToDeduct}`);
        return res.status(200).json({ message: "Delivery completed and fees deducted successfully." });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error completing delivery:", error);
        return res.status(500).json({ error: "Internal server error." });
    } finally {
        client.release();
    }
});










app.post("/api/household-orders", async (req, res) => {
    const { householdId, deliveryDate } = req.body;

    if (!householdId) {
        return res.status(400).json({ error: "Household ID is required." });
    }

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

    // Trigger database population during server startup
    try {
        console.log("Performing initial database population check...");
        await checkAndPopulateDatabase({}, {}, () => {});
    } catch (error) {
        console.error("Error during initial database population check:", error);
    }
});
