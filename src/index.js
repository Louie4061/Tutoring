const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json()); // allows my req.body to be parsed
app.use(express.static(path.join(__dirname, 'public'))); // allows me to add that html file at the end of my localhost line

// start our sql database
const db = new sqlite3.Database(
    path.join(__dirname, 'tutoring.db'),
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            console.error('Database connection error:', err);
            process.exit(1); // Exit if DB connection fails
        } else {
            console.log('Connected to SQLite database');
            initializeDatabase(); // Create tables after connection
        }
    }
);

// a global variable for our Id, will change
currId = 0; // this is really bad as not persistent

function initializeDatabase() {
    db.exec(`
CREATE TABLE IF NOT EXISTS Tutoring (
    StudentID INTEGER PRIMARY KEY,
    FirstName TEXT NOT NULL,
    LastName TEXT NOT NULL,
    Country TEXT,
    Year INTEGER,
    Phone TEXT,
    Email TEXT UNIQUE,
    School TEXT,
    Subject TEXT,
    SyllabusLink TEXT,
    CurrentTopics TEXT,           -- Stored as JSON string
    TutoringSchedule TEXT,        -- Stored as JSON string
    OtherAvailability TEXT,       -- Stored as JSON string
    Worksheets TEXT,              -- Stored as JSON string
    TestScores TEXT               -- Stored as JSON string
);
  `, (err) => {
        if (err) {
            console.error('Table creation error:', err);
        } else {
            console.log('Tutoring table created/verified');
        }
    });
}

// this puts our Tutoring in
app.put('/tutoring', (req, res) => {
    currId++;

    const {
        FirstName,
        LastName,
        Country,
        Year,
        Phone,
        Email,
        School,
        Subject,
        SyllabusLink,
        CurrentTopics,
        TutoringSchedule,
        OtherAvailability,
        Worksheets,
        TestScores
    } = req.body;

    db.run(
        `INSERT INTO Tutoring (
            StudentID,
            FirstName,
            LastName,
            Country,
            Year,
            Phone,
            Email,
            School,
            Subject,
            SyllabusLink,
            CurrentTopics,
            TutoringSchedule,
            OtherAvailability,
            Worksheets,
            TestScores
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            currId,
            FirstName,
            LastName,
            Country,
            Year,
            Phone,
            Email,
            School,
            Subject,
            SyllabusLink,
            JSON.stringify(CurrentTopics || []),
            JSON.stringify(TutoringSchedule || []),
            JSON.stringify(OtherAvailability || []),
            JSON.stringify(Worksheets || []),
            JSON.stringify(TestScores || [])
        ],
        function (err) {
            if (err) {
                console.error('Database error:', err.message);

                if (err.code === 'SQLITE_CONSTRAINT') {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(409).json({ error: 'Email or StudentID already exists' });
                    }
                    return res.status(400).json({ error: 'Data validation failed' });
                }

                return res.status(500).json({ error: 'Database operation failed' });
            }

            res.status(201).json({
                id: currId,
                message: 'Student created successfully'
            });
        }
    );
});

// Get all Tutoring from database
app.get('/tutoring', (req, res) => {
    db.all(
        `SELECT 
            StudentID as id,
            FirstName || ' ' || LastName as name,
            Country,
            Year,
            Email,
            Phone,
            School,
            Subject,
            SyllabusLink,
            CurrentTopics,
            TutoringSchedule,
            OtherAvailability,
            Worksheets,
            TestScores
        FROM Tutoring
        ORDER BY LastName, FirstName`,
        (err, rows) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database operation failed' });
            }

            // Parse complex fields (assuming they are stored as JSON strings)
            // I believe ..student gets the other fields
            const Tutoring = rows.map(student => ({
                ...student,
                year: student.Year,
                email: student.Email,
                current_topics: JSON.parse(student.CurrentTopics || '[]'),
                tutoring_schedule: JSON.parse(student.TutoringSchedule || '[]'),
                other_availability: JSON.parse(student.OtherAvailability || '[]'),
                worksheets: JSON.parse(student.Worksheets || '[]'),
                test_scores: JSON.parse(student.TestScores || '[]'),
                syllabus_link: student.SyllabusLink || '#',
                school: student.School || 'N/A',
                subject: student.Subject || 'General'
            }));

            res.json(Tutoring);
        }
    );
});

// DELETE all Tutoring from database
app.delete('/tutoring', (req, res) => {
    console.log("debug");
    db.run(`DELETE FROM Tutoring`, function (err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to delete Tutoring' });
        }

        res.json({ message: 'All Tutoring deleted', changes: this.changes });
    });
});


// Get a specific student by ID
app.get('/tutoring/:id', (req, res) => {
    const studentId = req.params.id;

    db.get(
        `SELECT 
            StudentID,
            FirstName,
            LastName,
            Country,
            Year,
            Phone,
            Email
        FROM Tutoring 
        WHERE StudentID = ?`,
        [studentId],
        (err, row) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database operation failed' });
            }

            if (!row) {
                console.log("The Id you tried was: ", studentId);
                return res.status(404).json({ error: 'Student not found' });
            }

            res.json(row);
        }
    );
});

// this will remove a student from the database
app.delete('/tutoring/:id', (req, res) => {
    db.run(
        'DELETE FROM Tutoring WHERE StudentID = ?',
        [req.params.id],
        function (err) {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: 'Database operation failed' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Student not found' });
            }

            res.json({ message: 'Student deleted successfully' });
        }
    );
});

// Routes
app.get('/start', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'student.html'));
});

// this initialises the Tutoring on ou page
app.get('/tutoring', (req, res) => {
    db.all(`
    SELECT 
      Tutoring.*,
      GROUP_CONCAT(DISTINCT schedules.day_time) AS tutoring_schedule,
      GROUP_CONCAT(DISTINCT availability.day_time) AS other_availability,
      GROUP_CONCAT(DISTINCT worksheets.title || '|' || worksheets.date || '|' || worksheets.type) AS worksheets,
      GROUP_CONCAT(DISTINCT scores.test_name || '|' || scores.score) AS test_scores
    FROM Tutoring
    LEFT JOIN schedules ON Tutoring.id = schedules.student_id
    LEFT JOIN availability ON Tutoring.id = availability.student_id
    LEFT JOIN worksheets ON Tutoring.id = worksheets.student_id
    LEFT JOIN scores ON Tutoring.id = scores.student_id
    GROUP BY Tutoring.id
  `, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Format the data for frontend
        const formatted = rows.map(row => ({
            ...row,
            tutoring_schedule: row.tutoring_schedule ? row.tutoring_schedule.split(',') : [],
            other_availability: row.other_availability ? row.other_availability.split(',') : [],
            worksheets: row.worksheets ? row.worksheets.split(',').map(w => {
                const [title, date, type] = w.split('|');
                return { title, date, type };
            }) : [],
            test_scores: row.test_scores ? row.test_scores.split(',').map(s => {
                const [test_name, score] = s.split('|');
                return { test_name, score };
            }) : []
        }));

        res.json(formatted);
    });
});

app.post('/tutoring/info', (req, res) => {
    const { name, email, school, year, subject, syllabus_link, current_topics } = req.body;

    db.run(
        `INSERT INTO Tutoring 
    (name, email, school, year, subject, syllabus_link, current_topics) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, school, year, subject, syllabus_link, current_topics],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });

            const studentId = currId;
            res.status(201).json({ id: studentId });
        }
    );
});

app.delete('/tutoring/:id', (req, res) => {
    db.run(
        'DELETE FROM Tutoring WHERE id = ?',
        [req.params.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ success: true });
        }
    );
});


// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;