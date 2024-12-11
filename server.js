import express from "express";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
import supermarkets from "./src/supermarketData.js"; // OUR VIRTUAL API WHICH POPULATED DATABASE

dotenv.config();

const {Pool} = pg;
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/api/test", (req, res) => {
    res.send("Server is running!");
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
    const oneMinute = 24 * 60 * 60 * 1000;

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
            }, 5000);

        }
    }

    if (next) next(); // Proceed to the next middleware or route handler
}

// Apply middleware globally
if (process.env.NODE_ENV !== 'test') {
    app.use(checkAndPopulateDatabase);
}
// 1. Login Endpoint
app.post("/api/login", async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: "Email and password are required"});
    }

    try {
        // Check if the user exists
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({error: "User not found"});
        }

        const user = result.rows[0];

        // Compare the entered password with the stored hashed password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(400).json({error: "Invalid password"});
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
                balance: parseFloat(user.balance) || 0,
                is_blocked: user.is_blocked
            },
            household,
        });
    } catch (err) {
        console.error("Error during user login:", err);
        res.status(500).json({error: "Server error"});
    }
});

// 2. Registration Endpoint
app.post("/api/register", async (req, res) => {
    const {firstName, lastName, email, password, pin, householdId} = req.body;

    if (!firstName || !lastName || !email || !password || !pin || !householdId) {
        return res.status(400).json({error: "All fields are required"});
    }

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({error: "PIN must be exactly 4 digits."});
    }

    try {
        // Check if the email is already registered
        const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({error: "Email already in use"});
        }

        // Check if the household exists
        const householdCheck = await pool.query("SELECT * FROM households WHERE household_id = $1", [householdId]);
        if (householdCheck.rows.length === 0) {
            return res.status(400).json({error: "Invalid Household ID"});
        }

        // Hash the password and PIN
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPin = await bcrypt.hash(pin, 10);

        // Insert the new user into the database
        await pool.query(
            "INSERT INTO users (household_id, first_name, last_name, email, password_hash, pin_password) VALUES ($1, $2, $3, $4, $5, $6)",
            [householdId, firstName, lastName, email, hashedPassword, hashedPin]
        );

        res.status(201).json({message: "Registration successful"});
    } catch (err) {
        console.error("Error during user registration:", err);
        res.status(500).json({error: "Server error"});
    }
});

// 3. Table Desk Login Endpoint
app.post("/api/table-login", async (req, res) => {
    const {householdId, pin} = req.body; // Get householdId and pin from the request body

    if (!householdId || !pin) {
        return res.status(400).json({error: "Household ID and PIN are required"});
    }

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({error: "PIN must be exactly 4 digits."});
    }

    try {
        // Fetch the household and its hashed PIN
        const result = await pool.query(
            "SELECT household_id, pin_password, address, coordinate_x, coordinate_y FROM households WHERE household_id = $1",
            [householdId]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({error: "Household not found"});
        }

        const { household_id, pin_password, address, coordinate_x, coordinate_y } = result.rows[0];

        // Compare the entered PIN with the stored hashed PIN
        const isPinValid = await bcrypt.compare(pin, pin_password);
        if (!isPinValid) {
            return res.status(400).json({error: "Invalid PIN"});
        }

        // If the PIN is valid, return success with the household details
        res.status(200).json({
            message: "Login successful",
            mode: "household",
            household: {
                householdId: household_id,
                address,
                coordinate_x,
                coordinate_y,},

        });
    } catch (err) {
        console.error("Error during table login:", err);
        res.status(500).json({error: "Server error"});
    }
});

app.post("/api/update", async (req, res) => {
    const {userId, field, value} = req.body;

    if (!userId || !field || value === undefined) {
        return res.status(400).json({error: "Invalid request data."});
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
            return res.status(400).json({error: "Invalid field to update."});
        }

        // Execute the query
        await pool.query(query, params);

        res.json({message: `${field} updated successfully.`});
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({error: "Internal server error."});
    }
});

// Top-up Balance
// server.js
app.post("/api/top-up", async (req, res) => {
    const {userId, amount, cardNumber} = req.body;

    // Basic Validation
    if (!userId || amount === undefined || !cardNumber) {
        return res.status(400).json({error: "Missing required fields."});
    }

    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
        return res.status(400).json({error: "Invalid amount."});
    }

    if (!/^\d{16}$/.test(cardNumber)) {
        return res.status(400).json({error: "Invalid card number. Must be 16 digits."});
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

        // Update the user's balance and unblock them if balance becomes positive
        const updateBalanceQuery = `
        UPDATE users
        SET balance = COALESCE(balance, 0) + $1,
            is_blocked = CASE WHEN COALESCE(balance, 0) + $1 >= 0 THEN false ELSE is_blocked END
        WHERE user_id = $2
        RETURNING balance, is_blocked
        `;

        const balanceResult = await client.query(updateBalanceQuery, [amount, userId]);

        if (balanceResult.rows.length === 0) {
            throw new Error("Failed to update user balance.");
        }

        const updatedBalance = parseFloat(balanceResult.rows[0].balance);
        const isBlocked = balanceResult.rows[0].is_blocked;

        await client.query("COMMIT");

        res.status(200).json({
            message: "Top-up successful.",
            paymentId: paymentId,
            updatedBalance: updatedBalance,
            isBlocked: isBlocked,
        });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error during top-up:", error);
        res.status(500).json({error: "Internal server error during top-up."});
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
    const {userId} = req.params;

    console.log(`[USER BALANCE] Received request with userId: ${userId}`);

    try {
        // Query the user's balance from the database
        const userQuery = 'SELECT * FROM users WHERE user_id = $1';
        const result = await pool.query(userQuery, [userId]);

        if (result.rows.length === 0) {
            console.log(`[USER BALANCE] No user found with userId: ${userId}`);
            return res.status(404).json({error: 'User not found'});
        }

        const user = result.rows[0];
        console.log(`[USER BALANCE] Retrieved user data:`, user);

        // Ensure the balance field is parsed as a float
        const balance = parseFloat(user.balance) || 0;
        console.log(`[USER BALANCE] Parsed balance: ${balance}`);

        // Send the response
        res.json({balance});
    } catch (error) {
        console.error(`[USER BALANCE] Error fetching balance for userId ${userId}:`, error);
        res.status(500).json({error: 'Internal Server Error'});
    }
});


// Deduct Payment


app.post("/api/deduct-payment", async (req, res) => {
    const {userId, orderId, amount} = req.body;

    if (!userId || typeof amount !== "number") {
        return res.status(400).json({error: "Missing required fields."});
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

        res.status(200).json({message: "Payment deducted successfully.", paymentId: paymentResult.rows[0].payment_id});
    } catch (error) {
        console.error("Error deducting payment:", error);
        res.status(500).json({error: "Internal server error during payment deduction."});
    }
});


app.get("/api/household/:householdId/users", async (req, res) => {
    const {householdId} = req.params;

    try {
        const result = await pool.query(
            "SELECT user_id, first_name, last_name FROM users WHERE household_id = $1",
            [householdId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: "No users found for this household."});
        }

        res.json({users: result.rows});
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({error: "Internal server error"});
    }
});

app.post("/api/user-orders", async (req, res) => {
    const {userId} = req.body;

    if (!userId) {
        return res.status(400).json({error: "User ID is required"});
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
            return res.status(404).json({message: "No orders found for this user."});
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

        res.json({orders});
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({error: "Internal server error"});
    }
});


app.post("/api/verify-user-pin", async (req, res) => {
    const {userId, pin} = req.body;

    if (!/^\d{4}$/.test(pin)) {
        return res.status(400).json({error: "Invalid PIN. Must be exactly 4 digits."});
    }

    try {
        // Fetch the user by ID
        const result = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: "User not found"});
        }

        const user = result.rows[0];

        // Verify the PIN
        const isPinValid = await bcrypt.compare(pin, user.pin_password);
        if (!isPinValid) {
            return res.status(400).json({error: "Invalid PIN"});
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
        res.status(500).json({error: "Server error"});
    }
});


// 4. Test Endpoint (Optional)
app.get("/api/test", (req, res) => {
    res.send("Server is running!");
});

// Add this to your server.js
app.get("/api/user/:userId", async (req, res) => {
    const {userId} = req.params;

    try {
        const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({error: "User not found"});
        }

        const user = result.rows[0];
        res.json({
            user: {
                user_id: user.user_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                household_id: user.household_id,
                balance: parseFloat(user.balance) || 0,
                is_blocked: user.is_blocked,
                mode: user.mode,
            },
        });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({error: "Internal server error"});
    }
});


app.post("/api/get-user-details", async (req, res) => {
    const {userId} = req.body;

    console.log(`[GET USER DETAILS] Received request with userId: ${userId}`);

    if (!userId) {
        console.error(`[GET USER DETAILS] Error: Missing userId in request`);
        return res.status(400).json({error: "User ID is required"});
    }

    try {
        // Log query to fetch user details
        console.log(`[GET USER DETAILS] Querying user details for userId: ${userId}`);
        const userResult = await pool.query("SELECT * FROM users WHERE user_id = $1", [userId]);

        if (userResult.rows.length === 0) {
            console.error(`[GET USER DETAILS] Error: User with userId ${userId} not found`);
            return res.status(404).json({error: "User not found"});
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
        res.status(500).json({error: "Internal server error"});
    }
});


// server.js
app.post("/api/place-order", async (req, res) => {
    const {items, deliveryDate, deliveryFee = 5.0, serviceFee = 2.5, tax, userId, householdId} = req.body;
    console.log("Received Payload:", req.body);

    if (!items || !items.length || !deliveryDate || !userId) {
        return res.status(400).json({error: "Invalid order details."});
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Validate and process items
        const processedItems = items.map(item => {
            if (!item.product_id || isNaN(item.unit_price) || item.unit_price <= 0 || item.quantity <= 0) {
                throw new Error("Invalid item data.");
            }
            return {
                product_id: item.product_id,
                quantity: parseInt(item.quantity, 10),
                unit_price: parseFloat(item.unit_price),
                subtotal: parseFloat(item.unit_price) * parseInt(item.quantity, 10),
            };
        });

        // Calculate totals
        const grocerySubtotal = processedItems.reduce((sum, item) => sum + item.subtotal, 0);
        const amountToDeduct = grocerySubtotal + parseFloat(tax);

        // Fetch and validate user balance
        const userBalanceResult = await client.query(
            `SELECT COALESCE(balance, 0) AS balance FROM users WHERE user_id = $1`,
            [userId]
        );

        if (userBalanceResult.rows.length === 0) {
            throw new Error("User not found.");
        }

        let userBalance = parseFloat(userBalanceResult.rows[0].balance);
        console.log(`User Balance (ID: ${userId}): ${userBalance}`);
        console.log(`Grocery + Tax Amount: ${amountToDeduct}`);

        if (isNaN(userBalance)) userBalance = 0;

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
        const deductionAmount = -amountToDeduct;
        const updatedBalanceResult = await client.query(
            `UPDATE users
             SET balance = COALESCE(balance, 0) + $1
             WHERE user_id = $2
             RETURNING balance`,
            [deductionAmount, userId]
        );
        const updatedBalance = parseFloat(updatedBalanceResult.rows[0].balance);
        console.log(`Updated Balance: ${updatedBalance}`);

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

        // Fetch unique users who placed orders on the same delivery date and household
        const uniqueUsersResult = await client.query(
            `SELECT DISTINCT user_id
             FROM orders
             WHERE household_id = $1 AND delivery_date = $2`,
            [householdId, deliveryDate]
        );
        const uniqueUsers = uniqueUsersResult.rows.map(row => row.user_id);
        const totalUniqueUsers = uniqueUsers.length;

        console.log(`Unique Users for Delivery Fee Split: ${uniqueUsers}`);

        // Recalculate shared delivery and service fees
        const sharedDeliveryFee = parseFloat(deliveryFee) / totalUniqueUsers;
        const sharedServiceFee = parseFloat(serviceFee) / totalUniqueUsers;

        // Insert order items
        for (const item of processedItems) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, user_id, quantity, unit_price, subtotal, delivery_fee_share, service_fee_share)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    orderId,
                    item.product_id,
                    userId,
                    item.quantity,
                    item.unit_price,
                    item.subtotal,
                    sharedDeliveryFee,
                    sharedServiceFee,
                ]
            );
        }

        // Update all related order items with recalculated shared fees
        await client.query(
            `UPDATE order_items
             SET delivery_fee_share = $1, service_fee_share = $2
             WHERE order_id IN (
                 SELECT order_id
                 FROM orders
                 WHERE household_id = $3 AND delivery_date = $4
             )`,
            [sharedDeliveryFee, sharedServiceFee, householdId, deliveryDate]
        );

        await client.query("COMMIT");
        console.log(`Order placed successfully with ID: ${orderId}`);
        return res.status(200).json({message: "Order placed successfully!", orderId});
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error placing order:", error.message);
        return res.status(500).json({error: "Failed to place order.", details: error.message});
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
            return res.status(200).json({orders: []});
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

        res.json({orders});
    } catch (error) {
        console.error("Error fetching courier orders:", error);
        res.status(500).json({error: "Internal server error"});
    }
});


app.post("/api/complete-delivery", async (req, res) => {
    const {orderId} = req.body;

    if (!orderId) {
        return res.status(400).json({error: "Order ID is required."});
    }

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Fetch order details
        const orderResult = await client.query(
            `SELECT o.household_id, o.delivery_date, o.status, oi.user_id, oi.delivery_fee_share, oi.service_fee_share, u.balance, u.is_blocked
             FROM orders o
             JOIN order_items oi ON o.order_id = oi.order_id
             JOIN users u ON oi.user_id = u.user_id
             WHERE o.order_id = $1 FOR UPDATE`,
            [orderId]
        );

        if (orderResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({error: "Order not found."});
        }

        const {household_id, delivery_date, status} = orderResult.rows[0];
        if (status !== "Pending") {
            await client.query("ROLLBACK");
            return res.status(400).json({error: "Order not in a state to complete delivery."});
        }

        // Fetch related orders for the same household and delivery date
        const relatedOrdersResult = await client.query(
            `SELECT o.order_id, oi.user_id, oi.delivery_fee_share, oi.service_fee_share, u.balance, u.is_blocked
             FROM orders o
             JOIN order_items oi ON o.order_id = oi.order_id
             JOIN users u ON oi.user_id = u.user_id
             WHERE o.household_id = $1 AND o.delivery_date = $2 AND o.status = 'Pending' FOR UPDATE`,
            [household_id, delivery_date]
        );

        const relatedOrders = relatedOrdersResult.rows;

        // Process each order
        for (const order of relatedOrders) {
            const {user_id, delivery_fee_share, service_fee_share, balance, is_blocked} = order;

            if (is_blocked) {
                await client.query("ROLLBACK");
                return res.status(403).json({error: `User ID ${user_id} is blocked.`});
            }

            const totalFeeToDeduct = parseFloat(delivery_fee_share || 0) + parseFloat(service_fee_share || 0);
            const newBalance = parseFloat(balance) - totalFeeToDeduct;

            // Update user balance and block if necessary
            await client.query(
                `UPDATE users
                 SET balance = $1, is_blocked = $2
                 WHERE user_id = $3`,
                [newBalance, newBalance < 0, user_id]
            );

            // Record payment
            await client.query(
                `INSERT INTO payments (user_id, order_id, amount, status, transaction_date)
                 VALUES ($1, $2, $3, 'completed', NOW())`,
                [user_id, orderId, -totalFeeToDeduct]
            );
        }

        // Mark all related orders as 'Completed'
        const orderIds = relatedOrders.map((order) => order.order_id);
        await client.query(
            `UPDATE orders SET status = 'Completed' WHERE order_id = ANY($1)`,
            [orderIds]
        );

        await client.query("COMMIT");
        return res.status(200).json({message: "Delivery completed successfully."});
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error completing delivery:", error);
        return res.status(500).json({error: "Internal server error."});
    } finally {
        client.release();
    }
});


app.post("/api/household-orders", async (req, res) => {
    const {householdId, deliveryDate} = req.body;

    if (!householdId) {
        return res.status(400).json({error: "Household ID is required."});
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
            return res.status(404).json({message: "No orders found for this household."});
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

        res.json({orders});
    } catch (error) {
        console.error("Error fetching household orders:", error);
        res.status(500).json({error: "Internal server error"});
    }
});


// // Start the server
// const server = app.listen(port, async () => {
//     console.log(`Server running on http://localhost:${port}`);
//
//     // Trigger database population during server startup
//     try {
//         console.log("Performing initial database population check...");
//         await checkAndPopulateDatabase({}, {}, () => {});
//     } catch (error) {
//         console.error("Error during initial database population check:", error);
//     }
// });

export { pool, checkAndPopulateDatabase};
