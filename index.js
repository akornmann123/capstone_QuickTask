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

// completed tasks
app.get('/completed', async (req, res) => {
    try {
        const client = await pool.connect();
        const sql = "SELECT userAccounts.fName, userAccounts.lName, tasks.title, tasks.description FROM userAccounts INNER JOIN tasks ON userAccounts.id = tasks.user_id WHERE completed = true ORDER BY tasks.id ASC;";

        const completedTasks = await client.query(sql);
        console.log("Completed Tasks:", completedTasks.rows);

        // Create task details array
        const taskDetails = completedTasks.rows.map(task => {
            return `<br>Task Title: ${task.title}<br>Task description: ${task.description}<br>Completed By: ${task.fname} ${task.lname}<br>`;
        });

        // Output completed tasks
        res.send(`Completed Tasks:<br>${taskDetails.join('')}`)

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
