💰 SAKUKU F6 - Backend Logic & Security
Halo Challenger! 👋
Selamat datang di repositori Sakuku F6. Folder ini telah ditingkatkan dari sekadar CRUD biasa menjadi aplikasi yang memiliki standar keamanan User Authentication dan Session Management.

📂 Penjelasan Struktur File Terbaru
1. app.js (Main Entry Point & Security Logic)
Fungsi: Pusat kendali aplikasi.

Update Terbaru: - Express-Session: Sekarang menangani State Management agar user tidak perlu login berulang kali.

Unified Logic: Menangani alur masuk/keluar user dan proteksi data pengeluaran.

2. config/database.js
Fungsi: Jembatan ke MySQL.

Status: Menggunakan mysql2/promise untuk mendukung fitur Async/Await agar aplikasi lebih cepat dan anti-lag.

3. view/index.ejs (The Heart of UI)
Fungsi: Tampilan dashboard yang adaptif.

Fitur Baru: - Conditional Rendering: Tampilan berubah otomatis dari Form Login ke Dashboard utama jika variabel isLoggedIn bernilai true.

SweetAlert2 Integration: Logika konfirmasi penghapusan dan logout berada di sini untuk mencegah kesalahan user (Accidental Data Loss).

4. package.json
Dependency Baru: express-session ditambahkan untuk mendukung fitur keamanan.

🔒 Aspek Keamanan Siber (Untuk Laporan RTM)
Aplikasi ini tidak hanya sekadar bisa input data, tapi sudah memperhatikan poin-poin berikut:

Authentication: Verifikasi kredensial user melalui tabel users di database.

Authorization (Session): Memastikan hanya user yang memiliki sesi aktif yang bisa melihat dan mengelola data keuangan.

Data Integrity: Menggunakan Prepared Statements pada semua query SQL (misal: [username, password]) untuk mencegah serangan SQL Injection.

User Validation: Validasi nominal transaksi di sisi server untuk mencegah data korup atau negatif.

🚀 Cara Menjalankan (Environment Docker)
Karena aplikasi ini sudah dibungkus Docker, kalian tidak perlu pusing soal npm install di laptop lokal. Cukup:

Pastikan Docker Desktop aktif.

Buka terminal di root folder project.

Jalankan perintah sakti:

Bash
docker compose up --build
Buka browser: http://localhost:2586

⚠️ Peringatan Penting
Credential Leak: Jangan mengubah password admin123 di init.sql tanpa melakukan docker compose down -v agar database ter-reset dengan password baru.

Session Secret: Dalam lingkungan produksi, secret pada konfigurasi session di app.js harus menggunakan string yang sangat kompleks.

Happy Coding & Stay Secure! 🛡️💻