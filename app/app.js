const express = require('express');
const session = require('express-session'); // 1. Tambahan Baru
const app = express();
const path = require('path');
const db = require('./config/database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 2. Konfigurasi Session (Penting agar tidak balik ke login terus)
app.use(session({
    secret: 'sakuku_f6_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // Sesi aktif selama 1 jam
}));

// ==========================================
// 1. ROUTE UTAMA (DASHBOARD & LOGIN UNIFIED)
// ==========================================

app.get('/', async (req, res) => {
    const search = req.query.search || '';
    try {
        const [rows] = await db.query(`
            SELECT p.*, k.nama_kategori 
            FROM Pengeluaran p 
            LEFT JOIN Kategori k ON p.PengeluaranID = k.PengeluaranID
            WHERE p.keterangan LIKE ? OR k.nama_kategori LIKE ?
            ORDER BY p.tanggal DESC
        `, [`%${search}%`, `%${search}%`]);
        
        // Cek status login dari session
        const statusLogin = req.session.isLoggedIn || false;

        res.render("index", { 
            data: rows, 
            search: search, 
            isLoggedIn: statusLogin, 
            error: null 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database connection failed!");
    }
});

// ==========================================
// 2. FITUR LOGIN & LOGOUT
// ==========================================

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [userRows] = await db.query(
            "SELECT * FROM users WHERE username = ? AND password = ?", 
            [username, password]
        );

        if (userRows.length > 0) {
            // SET SESSION JADI TRUE
            req.session.isLoggedIn = true;
            res.redirect('/');
        } else {
            const [dataRows] = await db.query("SELECT p.*, k.nama_kategori FROM Pengeluaran p LEFT JOIN Kategori k ON p.PengeluaranID = k.PengeluaranID ORDER BY p.tanggal DESC");
            res.render("index", { 
                data: dataRows, 
                search: '', 
                isLoggedIn: false, 
                error: "Username atau Password salah!" 
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal login");
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(); // Hapus session saat logout
    res.redirect('/');
});

// ==========================================
// 3. FITUR CRUD
// ==========================================

app.post('/add', async (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    
    if (!nominal || nominal <= 0) {
        return res.send("<script>alert('Nominal harus lebih dari 0!'); window.location='/';</script>");
    }

    try {
        const q1 = "INSERT INTO Pengeluaran (nominal, keterangan, tanggal, metode_pembayaran) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(q1, [nominal, keterangan, tanggal, metode_pembayaran]);
        
        const q2 = "INSERT INTO Kategori (nama_kategori, PengeluaranID) VALUES (?, ?)";
        await db.query(q2, [nama_kategori, result.insertId]);
        
        res.redirect('/'); // Sekarang akan tetap di dashboard karena session masih true
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menambah data");
    }
});

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
        res.status(500).send("Error edit");
    }
});

app.post('/update/:id', async (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    const { id } = req.params;
    try {
        await db.query(`UPDATE Pengeluaran SET nominal = ?, keterangan = ?, tanggal = ?, metode_pembayaran = ? WHERE PengeluaranID = ?`, 
        [nominal, keterangan, tanggal, metode_pembayaran, id]);
        await db.query("UPDATE Kategori SET nama_kategori = ? WHERE PengeluaranID = ?", [nama_kategori, id]);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Gagal update");
    }
});

app.get('/delete/:id', async (req, res) => {
    try {
        await db.query("DELETE FROM Pengeluaran WHERE PengeluaranID = ?", [req.params.id]);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Gagal hapus");
    }
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server Sakuku Berjalan di Port ${PORT}`));