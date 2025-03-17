const express = require("express");
const mysql = require("mysql2");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT_HTTP = 5000;
const PORT_HTTPS = 5001;

// Load SSL Certificates
const options = {
  key: fs.readFileSync("./certs/server.key"),
  cert: fs.readFileSync("./certs/server.cert"),
};



const db = require("./database");

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  } else {
    console.log("Connected to MariaDB");
  }
});

app.get("/", (req, res) => {
    res.send("Node.js server is running!");
  });

// API Route to Fetch Users
app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

// Start HTTP Server
app.listen(PORT_HTTP, '0.0.0.0',() => {
  console.log(`HTTP Server running on http://localhost:${PORT_HTTP}`);
});

// Start HTTPS Server
https.createServer(options, app).listen(PORT_HTTPS,'0.0.0.0', () => {
  console.log(`HTTPS Server running on https://localhost:${PORT_HTTPS}`);
});
