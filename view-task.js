const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/view-task/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
    if (rows.length === 1) {
      res.render('view-task.ejs', { task: rows[0] });
    } else {
      res.status(404).json({ error: 'Task not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
