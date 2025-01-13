const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function initializeDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`
    );
    await connection.query(`USE ${dbConfig.database}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) DEFAULT 'Voucher',
        max_expiry_days INT DEFAULT 30,
        voucher_width INT DEFAULT 210,
        voucher_height INT DEFAULT 297,
        title_font_size INT DEFAULT 25,
        text_font_size INT DEFAULT 12,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS Vouchers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        number VARCHAR(10) NOT NULL,
        generated_date DATETIME NOT NULL,
        expiry_date DATETIME NOT NULL,
        qr_code LONGTEXT NOT NULL,
        status ENUM('active', 'used', 'expired') DEFAULT 'active',
        created_by INT,
        FOREIGN KEY (created_by) REFERENCES Users(id)
      )
    `);

    await connection.query(`
      INSERT IGNORE INTO Users (username, password)
      VALUES ('Rizwanu', 'Rizwanu123')
    `);

    // Add default settings record
    await connection.query(`
      INSERT IGNORE INTO Settings (
        title,
        max_expiry_days,
        voucher_width,
        voucher_height,
        title_font_size,
        text_font_size
      ) VALUES (
        'Gift Voucher',
        30,
        210,
        297,
        25,
        12
      )
    `);

    await connection.end();
    console.log("Database and tables initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function executeQuery(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Query execution error:", error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  executeQuery,
};
