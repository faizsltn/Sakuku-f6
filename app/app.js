const express = require('express');
const app = express();
const path = require('path');
const db = require('./config/database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// (R) READ: Menampilkan data gabungan Pengeluaran & Kategori
app.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, k.nama_kategori 
            FROM Pengeluaran p 
            LEFT JOIN Kategori k ON p.PengeluaranID = k.PengeluaranID
            ORDER BY p.tanggal DESC
        `);
        res.render("index", { data: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database connection failed!");
    }
});

// (C) CREATE: Menambah data baru ke dua tabel
app.post('/add', async (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    try {
        const q1 = "INSERT INTO Pengeluaran (nominal, keterangan, tanggal, metode_pembayaran) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(q1, [nominal, keterangan, tanggal, metode_pembayaran]);
        
        const q2 = "INSERT INTO Kategori (nama_kategori, PengeluaranID) VALUES (?, ?)";
        await db.query(q2, [nama_kategori, result.insertId]);
        
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menambah data: " + err.message);
    }
});

// (U) EDIT: Mengambil data lama untuk ditampilkan di form edit
app.get('/edit/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, k.nama_kategori 
            FROM Pengeluaran p 
            LEFT JOIN Kategori k ON p.PengeluaranID = k.PengeluaranID
            WHERE p.PengeluaranID = ?
        `, [req.params.id]);
        
        if (rows.length > 0) {
            res.render("edit", { item: rows[0] });
        } else {
            res.status(404).send("Data tidak ditemukan");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal mengambil data edit");
    }
});

// (U) UPDATE: Menyimpan perubahan data ke database
app.post('/update/:id', async (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    const { id } = req.params;
    try {
        // Update tabel Pengeluaran
        await db.query(`
            UPDATE Pengeluaran 
            SET nominal = ?, keterangan = ?, tanggal = ?, metode_pembayaran = ? 
            WHERE PengeluaranID = ?
        `, [nominal, keterangan, tanggal, metode_pembayaran, id]);
        
        // Update tabel Kategori
        await db.query("UPDATE Kategori SET nama_kategori = ? WHERE PengeluaranID = ?", [nama_kategori, id]);
        
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal memperbarui data");
    }
});

// (D) DELETE: Menghapus data (Otomatis menghapus kategori karena CASCADE)
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