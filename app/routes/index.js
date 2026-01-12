const express = require('express');
const router = express.Router();

// Route untuk menampilkan halaman utama Sakuku
router.get('/', (req, res) => {
    // Memanggil file index.ejs dari folder view
    res.render('index', { title: 'Sakuku - Kelompok F6' });
});

module.exports = router;