const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/create-task', async (req, res) => {
  const task = req.body; 
  try {
    await pool.query('INSERT INTO tasks (name, description, due_date, assigned_to, employee_email, notes) VALUES ($1, $2, $3, $4, $5, $6)', [task.name, task.description, task.due_date, task.assigned_to, task.employee_email, task.notes]);
    res.status(201).json({ message: 'Task created successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
