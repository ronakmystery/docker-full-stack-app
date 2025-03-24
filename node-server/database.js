const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST || "mariadb",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "mydb",
});
module.exports = db;
