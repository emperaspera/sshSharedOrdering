import bcrypt from "bcrypt";
import pkg from "pg"; // Default import for CommonJS modules

const { Pool } = pkg;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "ssh",
    password: "'vbkm2005",
    port: 5432,
});

const updateHouseholdPins = async () => {
    try {
        const households = [
            { householdId: 1, pin: "1111" },
            { householdId: 2, pin: "2222" },
            { householdId: 3, pin: "3333" },
        ];

        for (const household of households) {
            const hashedPin = await bcrypt.hash(household.pin, 10);

            await pool.query(
                "UPDATE households SET pin_password = $1 WHERE household_id = $2",
                [hashedPin, household.householdId]
            );

            console.log(`Household ${household.householdId} PIN updated.`);
        }
    } catch (err) {
        console.error("Error updating household PINs:", err);
    } finally {
        pool.end();
    }
};

updateHouseholdPins();
