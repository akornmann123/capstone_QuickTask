require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function runMigration() {
    const client = await pool.connect();
    try {
        const schemaSql = fs.readFileSync('schema.sql', 'utf8');

        await client.query(schemaSql);
        console.log('Schema migration completed.');
    } finally {
        client.release();
    }
}

// Run schema.sql
runMigration().catch(err => console.error('Error during migration:', err));

app.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const sql = "SELECT * FROM userAccounts ORDER BY id ASC;";
        const users = await client.query(sql);
        console.log("Users:", users.rows);

        const words = users.rows.map(user => user.fname);

        res.send(`First Names: ${words.join(', ')}`);
    } catch (err) {
        console.error(err);
        res.set({
            "Content-Type": "application/json"
        });
        res.json({
            error: err
        });
    }
});

app.get('/test', async (req, res) => {
    try {
        const client = await pool.connect();
        res.send('Database connection test successful!');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection test failed.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
