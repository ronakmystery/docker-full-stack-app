CREATE DATABASE IF NOT EXISTS mydb;
USE mydb;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL 
);

INSERT INTO users (email, password) VALUES 
    ('alice@example.com', 'alice'),
    ('bob@example.com', 'bob');
