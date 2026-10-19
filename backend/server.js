const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the frontend too, so http://localhost:3000 opens the page
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const FIELDS = ['festival_name', 'artist_name', 'stage', 'genre', 'performance_date', 'start_time'];

// Convert empty strings to null and pick only the allowed fields
function cleanBody(body = {}) {
  const data = {};
  for (const f of FIELDS) {
    let v = body[f];
    if (typeof v === 'string') v = v.trim();
    data[f] = v === '' || v === undefined ? null : v;
  }
  return data;
}

function validate(data) {
  if (!data.festival_name) return 'festival_name is required';
  if (!data.artist_name) return 'artist_name is required';
  return null;
}

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Music Festival Line-Up API is running', resource: '/api/lineup' });
});

// GET /api/lineup -> list all records
app.get('/api/lineup', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM lineup ORDER BY performance_date, start_time, id'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/lineup/:id -> get one record
app.get('/api/lineup/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM lineup WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/lineup -> create a record
app.post('/api/lineup', async (req, res) => {
  const data = cleanBody(req.body);
  const problem = validate(data);
  if (problem) return res.status(400).json({ error: problem });

  try {
    const [result] = await pool.query(
      `INSERT INTO lineup (festival_name, artist_name, stage, genre, performance_date, start_time)
       VALUES (?, ?, ?, ?, ?, ?)`,
      FIELDS.map((f) => data[f])
    );
    const [rows] = await pool.query('SELECT * FROM lineup WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/lineup/:id -> update a record
app.put('/api/lineup/:id', async (req, res) => {
  const data = cleanBody(req.body);
  const problem = validate(data);
  if (problem) return res.status(400).json({ error: problem });

  try {
    const [result] = await pool.query(
      `UPDATE lineup
       SET festival_name = ?, artist_name = ?, stage = ?, genre = ?,
           performance_date = ?, start_time = ?
       WHERE id = ?`,
      [...FIELDS.map((f) => data[f]), req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    const [rows] = await pool.query('SELECT * FROM lineup WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/lineup/:id -> delete a record
app.delete('/api/lineup/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM lineup WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Record not found' });
    res.json({ message: 'Record deleted', id: Number(req.params.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
