const express = require('express');
const app = express();
const path = require('path');
const db = require('./config/database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// (R) READ: Mengambil data gabungan Pengeluaran & Kategori
app.get('/', async (req, res) => {
    const query = `
        SELECT p.*, k.nama_kategori 
        FROM Pengeluaran p 
        LEFT JOIN Kategori k ON p.PengeluaranID = k.PengeluaranID
        ORDER BY p.tanggal DESC
    `;
    await db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send(err);
        }
        res.render('index', { data: results });
    });
});

app.get('/home', (req, res) => {
    res.render('index')
})

// (C) CREATE: Menambah data ke tabel Pengeluaran lalu Kategori
app.post('/add',async (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    const q1 = "INSERT INTO Pengeluaran (nominal, keterangan, tanggal, metode_pembayaran) VALUES (?, ?, ?, ?)";
    
    await db.query(q1, [nominal, keterangan, tanggal, metode_pembayaran],async (err, result) => {
        if (err) return res.status(500).send(err);
        
        const q2 = "INSERT INTO Kategori (nama_kategori, PengeluaranID) VALUES (?, ?)";
        await db.query(q2, [nama_kategori, result.insertId], (err) => {
            if (err) return res.status(500).send(err);
            res.redirect('/');
        });
    });
});

// (D) DELETE: Menghapus data
app.get('/delete/:id',async (req, res) => {
    await db.query("DELETE FROM Pengeluaran WHERE PengeluaranID = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

app.listen(3000, () => console.log('Server Sakuku Berjalan di Port 3000'));