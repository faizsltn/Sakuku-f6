const express = require('express');
const app = express();
const path = require('path');
const db = require('./config/database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// (R) Read: Menampilkan riwayat transaksi [cite: 70]
app.get('/', (req, res) => {
    const query = `
        SELECT p.*, k.nama_kategori 
        FROM Pengeluaran p 
        LEFT JOIN Kategori k ON p.PengeluaraID = k.PengeluaraID
    `;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { data: results });
    });
});

// (C) Create: Menambah data pengeluaran baru [cite: 69]
app.post('/add', (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    const q1 = "INSERT INTO Pengeluaran (nominal, keterangan, tanggal, metode_pembayaran) VALUES (?, ?, ?, ?)";
    
    db.query(q1, [nominal, keterangan, tanggal, metode_pembayaran], (err, result) => {
        if (err) throw err;
        const lastID = result.insertId;
        const q2 = "INSERT INTO Kategori (nama_kategori, PengeluaraID) VALUES (?, ?)";
        db.query(q2, [nama_kategori, lastID], (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });
});

// (D) Delete: Menghapus data [cite: 72]
app.get('/delete/:id', (req, res) => {
    db.query("DELETE FROM Pengeluaran WHERE PengeluaraID = ?", [req.params.id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.listen(3000, () => console.log('Server Sakuku Running on Port 3000 [cite: 75]'));