import { app } from "../server.js";
import request from "supertest";
import { pool } from "../db.js";
import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

let server;

beforeAll(() => {
    // Start the server on a unique port
    server = app.listen(5002, () => console.log("Test server running on port 5002"));
});

afterAll(async () => {
    // Close the server
    await new Promise((resolve) => server.close(resolve));
    // Close the database pool
    await pool.end();
});

describe("API Endpoints", () => {
    test("GET /api/test should return 200", async () => {
        const response = await request(app).get("/api/test");
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Server is running!");
    });

    test("POST /api/login should return 400 for missing credentials", async () => {
        const response = await request(app).post("/api/login").send({});
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Email and password are required");
    });

    test("POST /api/register should return 400 for missing fields", async () => {
        const response = await request(app).post("/api/register").send({
            firstName: "John",
            lastName: "Doe",
            email: "test@example.com",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("All fields are required");
    });

    test("POST /api/register should return 400 for invalid PIN", async () => {
        const response = await request(app).post("/api/register").send({
            firstName: "John",
            lastName: "Doe",
            email: "test@example.com",
            password: "password123",
            pin: "123", // Invalid PIN
            householdId: "1",
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("PIN must be exactly 4 digits.");
    });

});
