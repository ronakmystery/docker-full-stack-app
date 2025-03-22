const express = require("express");
const mysql = require("mysql2");
const os = require("os");
const fs = require("fs");
const bcrypt = require("bcryptjs");


const router = express.Router();
const db = mysql.createConnection({
    host: "mariadb",
    user: "root",
    password: "rootpassword",
    database: "mydb",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL...");
});


let flaskURL="http://flask-server:5002/"

const getTasks = async () => {
    try {
      let response = await fetch(flaskURL);
      let data = await response.json();
      console.log("checking flask server ",data)
    } catch (error) {
      console.error("Failed to get data:", error);
    }
  };
  getTasks()


// Get user by id
router.post("/user", (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    db.query("SELECT username,email FROM users WHERE ID = ?", [userId], (err, results) => {
        if (err) {
            console.error("MySQL Query Error:", err);
            return res.status(500).json({ error: "Database query failed" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(results[0]);
    });
});



//Login or Register Automatically
router.post("/login", async (req, res) => {
    const { username, email, password } = req.body;
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Email and password are required!" });
    }

    try {
        //Check if user exists
        const query = "SELECT id, password FROM users WHERE email = ?";
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.log("Database Error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (results.length > 0) {
                const user = results[0];

                try {
                    const match = await bcrypt.compare(password, user.password);
                    if (!match) {
                        return res.status(401).json({ error: "Incorrect password. Please try again." });
                    }

                    // If password matches, return success response
                    return res.json({ message: "Welcome back!", userId: user.id });

                } catch (error) {
                    return res.status(500).json({ error: "Internal server error" });
                }
            }



            //User doesn't exist, register them
            const insertQuery = "INSERT INTO users (username,email, password) VALUES (?,?, ?)";

            db.query(insertQuery, [username, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Registration failed" });
                }

                return res.json({ message: "User registered successfully!", userId: result.insertId });
            });

        });
    } catch (error) {
        console.log("Server Error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router