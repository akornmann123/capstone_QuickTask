require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const bcrypt = require('bcrypt');

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
app.use(express.static(path.join(__dirname, 'public')));

// include nav links on all pages
app.use((req, res, next) => {
    const navHtml = `
        <nav>
            <a href="/">Login</a>
            <a href="/tasks">Task List</a>
            <a href="/view-task">View My Tasks</a>
            <a href="/create-task">Create Task</a>
            <a href="/accountForm.html">Create Account</a>
            <a href="/completed">Completed Tasks</a>
        </nav>`;
    
    res.locals.nav = navHtml;
    next();
});

// Run schema.sql
 //runMigration().catch(err => console.error('Error during migration:', err));

 app.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const sql = "SELECT * FROM userAccounts ORDER BY id ASC;";
        const users = await client.query(sql);
        const userNames = users.rows.map(user => user.username);

        res.render('login.ejs', { nav: res.locals.nav, usernames: userNames });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// a route to handle login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const client = await pool.connect();

        const selectUserSQL = "SELECT * FROM userAccounts WHERE username = $1";
        const user = await client.query(selectUserSQL, [username]);

        if (user.rows.length === 1) {
            const storedHashedPassword = user.rows[0].password;

            const enteredPassword = hashPassword(password);

            // Successful login
            if (enteredPassword === storedHashedPassword) {

                // Set all users' isLoggedIn to false
                const logoutQuery = "UPDATE userAccounts SET isLoggedIn = false";
                await client.query(logoutQuery);

                // Set the current user's isLoggedIn to true
                const loginQuery = "UPDATE userAccounts SET isLoggedIn = true WHERE username = $1";
                await client.query(loginQuery, [username]);

                res.redirect('/tasks');
            } else {
                res.send('Invalid username or password. <a href="/">Back</a>');
            }
        } else {
            res.send('Invalid username or password. <a href="/">Back</a>');
        }

        client.release();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function createEmptyTask() {
    return {
        title: '',
        description: '',
        due_date: '',
        userId: null, // You may set it to the default user if applicable
        notes: ''
    };
}

async function fetchUsers() {
    try {
        const client = await pool.connect();
        const sql = "SELECT * FROM userAccounts ORDER BY id ASC";
        const users = await client.query(sql);
        client.release();
        return users.rows;
    } catch (err) {
        console.error(err);
        throw err;
    }
}


app.get('/create-task', async (req, res) => {
    try {
        const users = await fetchUsers();
        const emptyTask = createEmptyTask();

        res.render('create-task.ejs', { users, task: emptyTask });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Create Tasks
app.post('/create-task', async (req, res) => {
    try {
        const { title, description, due_date, userId, notes } = req.body;

        // Insert data into the tasks table
        const client = await pool.connect();
        const sql = 'INSERT INTO tasks (title, description, due_date, user_id, notes) VALUES ($1, $2, $3, $4, $5)';
        const values = [title, description, due_date, userId, notes];

        await client.query(sql, values);
        client.release();

        console.log("Task Created");
        res.redirect('/tasks');
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// require for hashing (Node.js Crypto Module)
const crypto = require('crypto');

// hash function
function hashPassword(password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    return hash.digest('hex');
}

// create account
app.post('/create-account', async (req, res) => {
    try {
        // extract form data from req.body
        const { fname, lname, job, username, password, confirmPassword } = req.body;

        // check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).send('Passwords do not match');
        }

        // Hash password
        const hashedPassword = hashPassword(password);

        // insert data into database
        const client = await pool.connect();
        const sql = 'INSERT INTO userAccounts (fname, lname, job, username, password) VALUES ($1, $2, $3, $4, $5)';
        //const values = [fname, lname, job, username, password];
        const values = [fname, lname, job, username, hashedPassword]; // insert hashedPassword into "password" field

        await client.query(sql, values);
        client.release();

        console.log('Account created successfully');
        res.redirect('/');
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
            return `<br>Id: ${user.id}<br>First Name: ${user.fname}<br>Last Name: ${user.lname}<br>Account Type: ${user.job}<br> Username: ${user.username}<br> Password (hashed): ${user.password}<br><br>Is Logged In: ${user.isLoggedIn}<br><br>`;
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
        const sql = "SELECT userAccounts.fName, userAccounts.lName, tasks.title, tasks.description, tasks.due_date, tasks.notes FROM userAccounts INNER JOIN tasks ON userAccounts.id = tasks.user_id WHERE completed = true ORDER BY tasks.id ASC;";

        const completedTasks = await client.query(sql);
        console.log("Completed Tasks:", completedTasks.rows);

        res.render('completed.ejs', { completedTasks: completedTasks.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// tasks
app.get('/tasks', async (req, res) => {
    try {
        const client = await pool.connect();
        const sql = "SELECT tasks.id, tasks.completed, tasks.title, tasks.description, tasks.due_date, tasks.notes, userAccounts.fname, userAccounts.lname FROM tasks INNER JOIN userAccounts ON tasks.user_id = userAccounts.id ORDER BY tasks.id ASC;";

        const taskList = await client.query(sql);
        //console.log("Task List:", taskList.rows);

        res.render('tasks.ejs', { taskList: taskList.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
    
app.post('/tasks/:id/notes', async (req, res) => {
    const taskId = req.params.id;
    const { notes } = req.body;

    try {
        const client = await pool.connect();
        const sql = "UPDATE tasks SET notes = $1 FROM userAccounts WHERE tasks.id = $2 AND tasks.user_id = userAccounts.id RETURNING tasks.*, userAccounts.fname, userAccounts.lName";

        // update notes in database
        const updatedTask = await client.query(sql, [notes, taskId]);
        client.release();

        // Create task list details array
        const taskListDetails = updatedTask.rows.map(task => {
        return `<br>Task Title: ${task.title}<br>Task Description: ${task.description}<br>Completed By: ${task.fname} ${task.lname}<br>Task Notes: ${task.notes}`;
    });

        // Output info plus note
        res.send(`<link rel="stylesheet" href="../../styles.css">Task List:<br>${taskListDetails.join('')}<br><a href="/tasks">Back</a>`)

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error'});
    }
});

// the edit task button found in the task list page
app.get('/edit-task/:id', async (req, res) => {
    const taskId = req.params.id;
    let client;

    try {
        client = await pool.connect();
        const taskSql = "SELECT tasks.*, userAccounts.fName, userAccounts.lName FROM tasks JOIN userAccounts ON tasks.user_id = userAccounts.id WHERE tasks.id = $1";
        const userSql = "SELECT id, fName, lName FROM userAccounts";

        try {
            const { rows: taskRows } = await client.query(taskSql, [taskId]);
            const { rows: userRows } = await client.query(userSql);

            if (taskRows.length === 1) {
                res.render('edit-task.ejs', { task: taskRows[0], users: userRows });
            } else {
                res.status(404).json({ error: 'Task not found.' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error.' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// the update task button found in the edit page
app.post('/update-task/:id', async (req, res) => {
    const taskId = req.params.id;
    const { title, description, userId, notes, completed, due_date } = req.body;
    const userIdNumber = parseInt(userId);
    let client;

    try {
        client = await pool.connect();
        const sql = "UPDATE tasks SET title = $1, description = $2, user_id = $3, notes = $4, completed = $5, due_date = $6 WHERE id = $7";

        try {
            const updatedTask = await client.query(sql, [title, description, userIdNumber, notes, completed, due_date, taskId]);
            res.redirect('/tasks');
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});


// view currently assigned tasks based on logged in user
app.get('/view-task', async (req, res) => {
    try {
        const loggedInQuery = "SELECT * FROM userAccounts WHERE isLoggedIn = true";
        const loggedInUser = await pool.query(loggedInQuery);

        if (loggedInUser.rows.length > 0) {
            const userTasksQuery = "SELECT tasks.id, tasks.title, tasks.description, tasks.due_date, tasks.notes, tasks.completed, userAccounts.fname, userAccounts.lname FROM tasks INNER JOIN userAccounts ON tasks.user_id = userAccounts.id WHERE tasks.user_id = $1";
            
            const userTasks = await pool.query(userTasksQuery, [loggedInUser.rows[0].id]);

            if (userTasks.rows.length > 0) {
                console.log(userTasks.rows);
                res.render('view-task.ejs', { tasks: userTasks.rows });
            } else {
                // no tasks are found
                res.render('view-task.ejs', { tasks: [] });
            }
        } else {
            // no logged-in user
            res.render('view-task.ejs', { tasks: [] });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
