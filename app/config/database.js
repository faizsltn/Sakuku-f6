const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
    // PERBAIKAN: Gunakan nama service database sesuai di docker-compose.yml
    host: process.env.DB_HOST, 
    // Gunakan user 'user' (bukan root) agar sinkron dengan init.sql
    user: process.env.DB_USER, 
    // Password harus string 'password' sesuai konfigurasi .env Anda
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,
    waitForConnection: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
  .then((connection) => {
    console.log("✅ Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });

module.exports = db;