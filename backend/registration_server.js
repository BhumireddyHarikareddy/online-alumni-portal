
const express = require('express'); 
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

// DB CONNECTION
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'jntua'
});

db.connect(err => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("MySQL Connected");
});

// REGISTER
app.post('/register', (req, res) => {
  console.log("DATA:", req.body); // debug

  const {
    first_name,
    last_name,
    email,
    password,
    admission_number,
    branch,
    passed_out_year,
    present_working,
    designation,
    city,
    phone,
    gender,
    dob,
    placement_type,
    company,
    institution
  } = req.body;

  // BASIC VALIDATION
  if (!first_name || !last_name || !email || !password || !admission_number) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const sql = `
    INSERT INTO users
    (first_name, last_name, email, password, admission_number, branch, passed_out_year, present_working, designation, city, phone, gender, dob, placement_type, company, institution)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.query(sql, [
    first_name,
    last_name,
    email,
    password,
    admission_number,
    branch,
    passed_out_year,
    present_working,
    designation,
    city,
    phone,
    gender,
    dob,
    placement_type,
    company || null,
    institution || null
  ], (err, result) => {

    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Registration successful" });
  });
});

// START SERVER
app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});