const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: 'db', // Harus sama dengan nama service di docker-compose [cite: 14, 75]
    user: 'root',
    password: process.env.DB_PASSWORD, // Mengambil dari file .env [cite: 19]
    database: 'sakuku_db'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi Gagal: ' + err.stack);
        return;
    }
    console.log('Terhubung ke database MySQL (Docker Network)');
});

module.exports = db;