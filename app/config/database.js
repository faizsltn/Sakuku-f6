const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    // PERBAIKAN: Gunakan nama service database sesuai di docker-compose.yml
    host: 'db_service', 
    // Gunakan user 'user' (bukan root) agar sinkron dengan init.sql
    user: process.env.DB_USER, 
    // Password harus string 'password' sesuai konfigurasi .env Anda
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi Database Gagal: ' + err.stack);
        return;
    }
    console.log('Terhubung ke database MySQL Sakuku (Kelompok F6)');
});

module.exports = db;