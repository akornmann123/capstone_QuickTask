require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname,)));


// Allow entry of index.html 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'));
});

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
            return `<br>Task Title: ${task.title}<br>Task Description: ${task.description}<br>Completed By: ${task.fname} ${task.lname}<br>`;
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




app.get('/tasks', async (req, res) => {
    try {
        const client = await pool.connect();
        const sql = "SELECT * FROM tasks";

        const taskList = await client.query(sql);
        console.log("Task List:", taskList.rows);

        // Create task details array
        const taskListDetails = taskList.rows.map(task => {
            return `
                <div>
                    <p>Task Title: ${task.title}</p>
                    <p>Task Description: ${task.description}</p>
                    
                    <form action="/tasks/${task.id}/notes" method="POST">
                        <label for="taskNotes"Add Notes:</label>
                        <input type="text" id="taskNotes" name="notes">
                        <button type="submit">Add Notes</button>
                    </form>
                </div>
                `;
        });

        // Output completed tasks
        res.send(`Task List:<br>${taskListDetails.join('')}`)

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
    app.use(express.urlencoded({ extended: true }));
    app.post('/tasks/:id/notes', async (req, res) => {
        const taskId = req.params.id;
        const { notes } = req.body;

        try {
            const client = await pool.connect();
            const sql = "UPDATE tasks SET notes = $1 WHERE id = $2 RETURNING *";

            // update notes in database
            const updatedTask = await client.query(sql, [notes, taskId]);
            client.release();

            res.status(200).json({ message: 'Notes added succesfully.', task: updatedTask.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error'});
        }
    });


/* Create task details array TESTING CODE
const taskListDetails = taskList.rows.map(task => {
    return `<br>Task Title: ${task.title}<br>Task Description: ${task.description}<br>Completed By: ${task.fname} ${task.lname}<br>`;*/




// TODO
app.get('/create-task', async (req, res) => {
    const task = req.body; 
    try {
      await pool.query('INSERT INTO tasks (userAccounts.fName, description, due_date, assigned_to, employee_email, notes) VALUES ($1, $2, $3, $4, $5, $6)', [task.fname, task.description, task.due_date, task.assigned_to, task.employee_email, task.notes]);
      res.status(201).json({ message: 'Task created successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
