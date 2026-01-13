const express = require('express');
const app = express();
const path = require('path');
const db = require('./config/database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',async (req, res) => {
    try {
        const [rows] = await db.query(
            `
            SELECT p.*, k.nama_kategori 
            FROM Pengeluaran p 
            LEFT JOIN Kategori k ON p.PengeluaranID = k.PengeluaranID
            ORDER BY p.tanggal DESC
        `);
        res.render("index", { data: rows });
      } catch (err) {
        console.error(err);
        res.render("index", { messages: [], error: "Database connection failed!" });
      }
})

// (C) CREATE: Menambah data ke tabel Pengeluaran lalu Kategori
app.post('/add', async (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    try {
        // 1. Masukkan ke tabel Pengeluaran
        const q1 = "INSERT INTO Pengeluaran (nominal, keterangan, tanggal, metode_pembayaran) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(q1, [nominal, keterangan, tanggal, metode_pembayaran]);
        
        // 2. Gunakan insertId untuk tabel Kategori
        const q2 = "INSERT INTO Kategori (nama_kategori, PengeluaranID) VALUES (?, ?)";
        await db.query(q2, [nama_kategori, result.insertId]);
        
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menambah data: " + err.message);
    }
});

// (D) DELETE: Menghapus data
app.get('/delete/:id', async (req, res) => {
    try {
        const query = "DELETE FROM Pengeluaran WHERE PengeluaranID = ?";
        await db.query(query, [req.params.id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menghapus data: " + err.message);
    }
});

app.listen(3000, () => console.log('Server Sakuku Berjalan di Port 3000'));