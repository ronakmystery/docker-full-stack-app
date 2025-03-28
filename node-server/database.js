const mysql = require("mysql2");

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


module.exports=db
