const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jntua'
});

db.connect(err => {
  if (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
  console.log("MySQL connected on server 2003");
});

// ===== LOGIN =====
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (result.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ student: result[0] });
  });
});

// ===== FORGOT PASSWORD =====
app.post('/forgot-password', (req, res) => {
  const { email, new_password } = req.body;
  if (!email || !new_password) return res.status(400).json({ error: 'Email and new password required' });

  const sql = 'UPDATE users SET password = ? WHERE email = ?';
  db.query(sql, [new_password, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Email not found' });

    res.json({ message: 'Password updated successfully' });
  });
});

// ===== START SERVER =====
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Login server running at http://localhost:${PORT}`);
});