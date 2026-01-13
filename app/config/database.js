const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    // PERBAIKAN: Gunakan nama service database sesuai di docker-compose.yml
    host: 'db_service', 
    // Gunakan user 'user' (bukan root) agar sinkron dengan init.sql
    user: 'user', 
    // Password harus string 'password' sesuai konfigurasi .env Anda
    password: 'password', 
    database: 'sakuku_db'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi Database Gagal: ' + err.stack);
        return;
    }
    console.log('Terhubung ke database MySQL Sakuku (Kelompok F6)');
});

module.exports = db;