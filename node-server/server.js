const express = require("express");
const mysql = require("mysql2");
const https = require("https");
const fs = require("fs");
const cors=require("cors")
const apiRoutes =require("./routes.js")

const app = express();

app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow all standard methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allow standard headers
}));

app.use(express.json());

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

  // API Routes
app.use("/api", apiRoutes);


// Start HTTP Server
app.listen(5000, '0.0.0.0',() => {
  console.log(`HTTP Server running on http://localhost:${5000}`);
});

// Start HTTPS Server
https.createServer(options, app).listen(5001,'0.0.0.0', () => {
  console.log(`HTTPS Server running on https://localhost:${5001}`);
});
