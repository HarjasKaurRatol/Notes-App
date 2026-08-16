require('dotenv').config({ quiet: true });

const express = require('express');
const cors = require('cors');
const { pool, initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// GET /api/notes - return all notes, newest first
app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, created_at FROM notes ORDER BY created_at DESC'
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes - create a note
app.post('/api/notes', async (req, res) => {
  const { title, description } = req.body || {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (title, description) VALUES ($1, $2) RETURNING id, title, description, created_at',
      [title.trim(), description ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// DELETE /api/notes/:id - delete a note by id
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;

  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: 'Invalid note id' });
  }

  try {
    const result = await pool.query('DELETE FROM notes WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Initialize the database, then start the server.
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
