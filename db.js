const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database (creates if doesn't exist)
const db = new sqlite3.Database(
    path.join(__dirname, 'tutoring.db'),
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) console.error('Database connection error:', err);
        else console.log('Connected to SQLite database');
    }
);

// Create tables (run this once)
function initializeDB() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      subject TEXT,
      grade INTEGER
    );
    
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      deadline TEXT,  -- ISO8601 strings (e.g., "2024-12-31")
      student_id INTEGER,
      FOREIGN KEY (student_id) REFERENCES students(id)
    );
  `);
}

module.exports = { db, initializeDB };