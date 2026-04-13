const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const db = require('./config/database');

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi Session (Aktif 1 Jam)
app.use(session({
    secret: 'sakuku_f6_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } 
}));

// Middleware: Proteksi Route (Hanya bisa diakses jika sudah login)
const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        res.redirect('/?error=Silakan login terlebih dahulu');
    }
};

// ==========================================
// 1. DASHBOARD UTAMA
// ==========================================
app.get('/', async (req, res) => {
    const search = req.query.search || '';
    try {
        // Query ambil data transaksi (User Biasa & Admin bisa lihat datanya sendiri/semua sesuai query ini)
        const [rows] = await db.query(`
            SELECT p.*, k.nama_kategori 
            FROM Pengeluaran p 
            LEFT JOIN Kategori k ON p.PengeluaranID = k.PengeluaranID
            WHERE p.keterangan LIKE ? OR k.nama_kategori LIKE ?
            ORDER BY p.tanggal DESC
        `, [`%${search}%`, `%${search}%`]);
        
        const statusLogin = req.session.isLoggedIn || false;
        const userRole = req.session.role || 'customer';
        const userName = req.session.username || '';

        // FITUR EKSKLUSIF ADMIN: Monitoring Total Pengeluaran Seluruh Database
        let totalSistem = 0;
        if (statusLogin && userRole === 'admin') {
            const [totalRows] = await db.query("SELECT SUM(nominal) as total FROM Pengeluaran");
            totalSistem = totalRows[0].total || 0;
        }

        res.render("index", { 
            data: rows, 
            search: search, 
            isLoggedIn: statusLogin, 
            role: userRole,
            username: userName,
            totalSistem: totalSistem,
            error: req.query.error || null,
            success: req.query.success || null 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal memuat dashboard");
    }
});

// ==========================================
// 2. IDENTITY MANAGEMENT (AUTH & RECOVERY)
// ==========================================

// Fitur Register dengan Security Question (Nama Ibu)
app.post('/register', async (req, res) => {
    const { username, email, password, security_answer } = req.body;
    try {
        const [existing] = await db.query("SELECT * FROM users WHERE username = ? OR email = ?", [username, email]);
        if (existing.length > 0) {
            return res.redirect('/?error=Username atau Email sudah terdaftar!');
        }

        await db.query(
            "INSERT INTO users (username, email, password, security_answer, role) VALUES (?, ?, ?, ?, 'customer')",
            [username, email, password, security_answer]
        );

        res.redirect('/?success=Pendaftaran berhasil! Silakan login.');
    } catch (err) {
        console.error(err);
        res.redirect('/?error=Gagal mendaftar user');
    }
});

// Fitur Login (Mendukung Username atau Email)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [userRows] = await db.query(
            "SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?", 
            [username, username, password]
        );

        if (userRows.length > 0) {
            req.session.isLoggedIn = true;
            req.session.username = userRows[0].username;
            req.session.role = userRows[0].role;
            res.redirect('/');
        } else {
            res.redirect('/?error=Username/Email atau Password salah!');
        }
    } catch (err) {
        res.redirect('/?error=Terjadi kesalahan sistem saat login');
    }
});

// Fitur Lupa Password (Verify Nama Ibu Kandung)
app.post('/forgot-password', async (req, res) => {
    const { email, answer, new_password } = req.body;
    try {
        const [user] = await db.query(
            "SELECT * FROM users WHERE email = ? AND security_answer = ?", 
            [email, answer]
        );

        if (user.length > 0) {
            await db.query("UPDATE users SET password = ? WHERE email = ?", [new_password, email]);
            res.redirect('/?success=Password berhasil direset! Silakan login.');
        } else {
            res.redirect('/?error=Email atau Jawaban Keamanan salah!');
        }
    } catch (err) {
        res.redirect('/?error=Gagal reset password');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// ==========================================
// 3. FITUR CRUD (PROTECTED BY ISAUTH)
// ==========================================

// Tambah Transaksi
app.post('/add', isAuth, async (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    if (!nominal || nominal <= 0) return res.send("<script>alert('Nominal tidak valid!'); window.location='/';</script>");

    try {
        const [result] = await db.query("INSERT INTO Pengeluaran (nominal, keterangan, tanggal, metode_pembayaran) VALUES (?, ?, ?, ?)", [nominal, keterangan, tanggal, metode_pembayaran]);
        await db.query("INSERT INTO Kategori (nama_kategori, PengeluaranID) VALUES (?, ?)", [nama_kategori, result.insertId]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menambah data");
    }
});

// Halaman Edit (Tampilan form edit)
app.get('/edit/:id', isAuth, async (req, res) => {
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
        res.status(500).send("Error memuat data");
    }
});

// Update Transaksi
app.post('/update/:id', isAuth, async (req, res) => {
    const { nominal, keterangan, tanggal, metode_pembayaran, nama_kategori } = req.body;
    try {
        await db.query(`UPDATE Pengeluaran SET nominal = ?, keterangan = ?, tanggal = ?, metode_pembayaran = ? WHERE PengeluaranID = ?`, [nominal, keterangan, tanggal, metode_pembayaran, req.params.id]);
        await db.query("UPDATE Kategori SET nama_kategori = ? WHERE PengeluaranID = ?", [nama_kategori, req.params.id]);
        res.redirect('/');
    } catch (err) {
        res.status(500).send("Gagal memperbarui data");
    }
});

// Hapus Transaksi
app.get('/delete/:id', isAuth, async (req, res) => {
    try {
        // Hapus kategori dulu jika tidak pakai ON DELETE CASCADE di SQL
        await db.query("DELETE FROM Kategori WHERE PengeluaranID = ?", [req.params.id]);
        await db.query("DELETE FROM Pengeluaran WHERE PengeluaranID = ?", [req.params.id]);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal menghapus data");
    }
});

const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server Sakuku F6 Aktif di Port ${PORT}`));