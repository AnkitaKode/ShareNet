-- ShareNet Database Setup Script
-- Run this script in MySQL to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS sharenet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE sharenet_db;

-- Create user (optional - you can use root user)
-- CREATE USER 'sharenet_user'@'localhost' IDENTIFIED BY 'sharenet_password';
-- GRANT ALL PRIVILEGES ON sharenet_db.* TO 'sharenet_user'@'localhost';
-- FLUSH PRIVILEGES;

-- The tables will be created automatically by Hibernate when you run the Spring Boot application
-- with spring.jpa.hibernate.ddl-auto=update

-- Verify database creation
SHOW DATABASES;
SELECT DATABASE();
