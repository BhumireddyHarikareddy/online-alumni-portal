const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =======================
   MYSQL CONNECTION
======================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "jntua"
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL Connected ✅");
  }
});

/* =======================
   ADMIN LOGIN
======================= */
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM admin_login WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (result.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      admin: result[0]
    });
  });
});

/* =======================
   ADD GALLERY IMAGE
======================= */
app.post("/admin/gallery", (req, res) => {
  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: "Image URL required" });
  }

  const sql = "INSERT INTO gallery (image_url) VALUES (?)";

  db.query(sql, [image_url], err => {
    if (err) return res.status(500).json({ error: "DB error" });

    res.json({ message: "Image added successfully" });
  });
});

/* =======================
   GET ALL STUDENTS
======================= */
app.get("/admin/students", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });

    res.json(result);
  });
});

/* =======================
   GET GALLERY IMAGES
======================= */
app.get("/gallery", (req, res) => {
  const sql = "SELECT * FROM gallery ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });

    res.json(result);
  });
});

/* =======================
   EVENTS FUNCTIONALITY 🔥
======================= */

/* ADD EVENT */
app.post("/admin/events", (req, res) => {
  const { title, event_date, description, image_url } = req.body;

  if (!title || !event_date) {
    return res.status(400).json({ error: "Title & date required" });
  }

  const sql = `
    INSERT INTO events (title, event_date, description, image_url)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, event_date, description || "", image_url || null],
    err => {
      if (err) {
        console.error("Event Insert Error:", err);
        return res.status(500).json({ error: "DB error" });
      }

      res.json({ message: "Event added successfully ✅" });
    }
  );
});

/* GET EVENTS */
app.get("/events", (req, res) => {
  const sql = "SELECT * FROM events ORDER BY event_date DESC";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });

    res.json(result);
  });
});

/* =======================
   DONATIONS
======================= */

/* ADD DONATION */
app.post("/donate", (req, res) => {
  const { name, email, amount, purpose, payment_method } = req.body;

  if (!name || !email || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO donations (name, email, amount, purpose, payment_method)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, amount, purpose || "", payment_method || ""],
    err => {
      if (err) {
        console.error("Donation Error:", err);
        return res.status(500).json({ error: "DB error" });
      }

      res.json({ message: "Donation recorded successfully ✅" });
    }
  );
});

/* GET DONATIONS */
app.get("/donations", (req, res) => {
  const sql = "SELECT * FROM donations ORDER BY created_at DESC";

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "DB error" });

    res.json(result);
  });
});

/* =======================
   SERVER
======================= */
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});