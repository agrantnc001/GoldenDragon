const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database',
    password: 'your_password',
    port: 5432,
});

// Function to initialize schema
const initializeSchema = async () => {
    const client = await pool.connect();
    try {
        await client.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await client.query(`CREATE TABLE IF NOT EXISTS transactions (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            amount DECIMAL(10, 2) NOT NULL,
            transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

        await client.query(`CREATE TABLE IF NOT EXISTS game_history (
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id),
            game_score INT NOT NULL,
            played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);
    } catch (err) {
        console.error('Error initializing schema:', err);
    } finally {
        client.release();
    }
};

// Export the pool and initializeSchema function
module.exports = {
    pool,
    initializeSchema,
};