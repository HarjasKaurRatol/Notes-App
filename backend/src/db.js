const { Pool } = require('pg');

// pg reads PGHOST/PGPORT/PGUSER/PGPASSWORD/PGDATABASE from the environment
// automatically, but we pass them explicitly so the config source is clear.
const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(1);
});

const CREATE_NOTES_TABLE = `
  CREATE TABLE IF NOT EXISTS notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

// Ensures the notes table exists. Called once when the server starts.
async function initDb() {
  await pool.query(CREATE_NOTES_TABLE);
}

module.exports = { pool, initDb };
