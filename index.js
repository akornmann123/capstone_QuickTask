require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const port = process.env.PORT || 3001;

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
app.get('/create-task', (req, res) => {
    

});
// Create Tasks
app.post('/create-task', function(req, res, next) {
    var title = req.body.title;
    var description = req.body.description;
    var due_date = req.body.due_date;
    var assigned_to = req.body.assigned_to;
    var employee_email = req.body.employee_email;
    var notes = req.body.notes;

    var sql = `INSERT INTO tasks (title, description, due_date, assigned_to, employee_email, notes ) VALUES ('${title}', '${description}', '${due_date}', '${assigned_to}', '${employee_email}', '${notes}')`;
    db.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Task Created");
        res.redirect('/');
    });
});


// create account
app.post('/create-account', async (req, res) => {
    try {
        // extract form data from req.body
        const { fname, lname, job, username, password, confirmPassword } = req.body;

        // check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        // insert data into database
        const client = await pool.connect();
        const sql = 'INSERT INTO userAccounts (fname, lname, job, username, password) VALUES ($1, $2, $3, $4, $5)';
        const values = [fname, lname, job, username, password];

        await client.query(sql, values);
        client.release();

        console.log('Account created successfully');
        res.redirect('/accounts'); // TODO redirect to account page
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ error: 'Internal server error'});
    }
});

// view accounts
app.get('/accounts', async (req, res) => {
    try {
        const client = await pool.connect();
        const sql = "SELECT * from userAccounts";

        const completedUsers = await client.query(sql);
        console.log("User Accounts", completedUsers.rows);

        // Create acount details array
        const accountDetails = completedUsers.rows.map(user => {
            return `<br>First Name: ${user.fname}<br>Last Name: ${user.lname}<br>Account Type: ${user.job} Username: ${user.username}<br> Password: ${user.password} Password Hashed: TODO`;
        });

        // Output completed accounts
        res.send(`Accounts:<br>${accountDetails.join('')}`)

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
        const sql = "SELECT * FROM tasks, userAccounts ORDER BY user_id ASC";

        const taskList = await client.query(sql);
        console.log("Task List:", taskList.rows);

        // Create task details array
        const taskListDetails = taskList.rows.map(task => {
            return `
                <div>
                    <p>Task Title: ${task.title}</p>
                    <p>Task Description: ${task.description}</p>
                    <p>Assigned To: ${userAccounts.fname}, ${userAccounts.lname}</p>
                    
                    <form action="/tasks/${task.id}/notes" method="POST">
                        <label for="taskNotes"Add Notes:</label>
                        <input type="text" id="taskNotes" name="notes">
                        <button type="submit">Add Notes</button>
                    </form>
                    <a href="/edit-task/${task.id}">
                        <button type="button">Edit Task</button>
                    </a>
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
    
    app.post('/tasks/:id/notes', async (req, res) => {
        const taskId = req.params.id;
        const { notes } = req.body;

        try {
            const client = await pool.connect();
            const sql = "UPDATE tasks SET notes = $1 WHERE id = $2 RETURNING *";

            // update notes in database
            const updatedTask = await client.query(sql, [notes, taskId]);
            client.release();

            // Create task list details array
            const taskListDetails = updatedTask.rows.map(task => {
            return `<br>Task Title: ${task.title}<br>Task Description: ${task.description}<br>Completed By: ${task.fname} ${task.lname}<br>Task Notes: ${task.notes}`;
        });

            // Output info plus note
        res.send(`Task List:<br>${taskListDetails.join('')}`)

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error'});
        }
    });


  // the edit task button found in the task list page
app.get('/edit-task/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
        const client = await pool.connect();
        const taskSql = "SELECT tasks.*, userAccounts.fName, userAccounts.lName FROM tasks JOIN userAccounts ON tasks.user_id = userAccounts.id WHERE tasks.id = $1";
        const userSql = "SELECT id, fName, lName FROM userAccounts";

        const { rows: taskRows} = await client.query(taskSql, [taskId]);
        const { rows: userRows} = await client.query(userSql);
  
      if (taskRows.length === 1) {
        res.render('edit-task.ejs', { task: taskRows[0], users: userRows });
      } else {
        res.status(404).json({ error: 'Task not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error.' });
    }
});

// the update task button found in the edit page
app.post('/update-task/:id', async (req, res) => {
    console.log(req.body);
    const taskId = req.params.id;
    const { title, description, userId, notes, status } = req.body;

    const userIdNumber = parseInt(userId);

    try {
        const client = await pool.connect();
        const sql = "UPDATE tasks SET title = $1, description = $2, user_id = $3, notes = $4, status = $5 WHERE id = $6";

        const updatedTask = await client.query(sql, [title, description, userIdNumber, notes, status, taskId]);
        client.release();

        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
