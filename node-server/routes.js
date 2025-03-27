const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const router = express.Router();

let db = mysql.createConnection({
  host: "mariadb",
  user: "root",
  password: "rootpassword",
  database: "mydb",
});

const connectWithRetry = () => {
  db = mysql.createConnection({
    host: "mariadb",
    user: "root",
    password: "rootpassword",
    database: "mydb",
  });

  db.connect((err) => {
    if (err) {
      console.error("DB connection failed, retrying in 3s...", err.message);
      setTimeout(connectWithRetry, 3000);
    } else {
      console.log("Connected to DB");
    }
  });
};
connectWithRetry();

// Get user by id
router.post("/user", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.query(
    "SELECT username,email FROM users WHERE ID = ?",
    [userId],
    (err, results) => {
      if (err) {
        console.error("MySQL Query Error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(results[0]);
    }
  );
});

//Login or Register Automatically
router.post("/login", async (req, res) => {
  const { username, email, password } = req.body;
  // Hash the password before storing
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    //Check if user exists
    const query = "SELECT id, password FROM users WHERE email = ?";
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error("MySQL Query Error:", err);
        return res.status(500).json({ error: "Database query failed" });
      }

      if (results.length > 0) {
        const user = results[0];

        try {
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return res
              .status(401)
              .json({ error: "Incorrect password. Please try again." });
          }

          return res.json({ message: "Welcome back!", userId: user.id });
        } catch (error) {
          return res.status(500).json({ error: "Internal server error" });
        }
      }

      //User doesn't exist, register them
      const insertQuery =
        "INSERT INTO users (username,email, password) VALUES (?,?, ?)";

      db.query(
        insertQuery,
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            return res.status(500).json({ error: "Registration failed" });
          }

          return res.json({
            message: "User registered successfully!",
            userId: result.insertId,
          });
        }
      );
    });
  } catch (error) {
    console.log("Server Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
