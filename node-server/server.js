const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const apiRoutes = require("./routes.js");
const websocket = require("./sockets.js");
const notificationRoute = require("./notifications");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// Connect to database
const db = require("./database");
function tryConnect(retries = 3, delay = 3000) {
  setTimeout(() => {
    db.connect((err) => {
      if (err) {
        console.error("Database connection failed:", err.message);
        if (retries > 0) {
          console.log(`🔁 Retrying in ${delay / 1000}s... (${retries} attempts left)`);
          tryConnect(retries - 1, delay);
        } else {
          console.error("Max retries reached. Exiting.");
          process.exit(1);
        }
      } else {
        console.log("Connected to MariaDB");
      }
    });
  }, delay);
}
tryConnect();

//default route
app.get("/", (req, res) => {
  res.send("Node.js server is running!");
});

// API Routes
app.use("/api", apiRoutes);
app.use("/api/notify", notificationRoute);

const http = require("http");
const server = http.createServer(app);

// Attach WebSocket to HTTP server
websocket(server);

server.listen(5000, '0.0.0.0', () => {
  console.log("HTTP server running on http://localhost:5000");
});
