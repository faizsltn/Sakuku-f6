-- =============================================
-- DATABASE SAKUKU F6 - FINAL VERSION
-- =============================================

-- 1. Persiapan Database
CREATE DATABASE IF NOT EXISTS sakuku_db;
USE sakuku_db;

-- 2. TABEL USER (Identity Management & Recovery)
-- Kolom security_answer digunakan untuk verifikasi saat Lupa Password
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    security_answer VARCHAR(255) NOT NULL, -- Jawaban pertanyaan keamanan (Nama Ibu)
    role ENUM('admin', 'customer') DEFAULT 'customer'
);

-- Data Akun Default untuk Demo
-- Password & Jawaban sengaja dibuat sederhana untuk memudahkan presentasi
INSERT IGNORE INTO users (username, email, password, security_answer, role) VALUES 
('admin', 'admin@sakuku.com', 'admin123', 'aminah', 'admin'),
('faiz', 'faiz@mail.com', 'faiz123', 'siti', 'customer');

-- 3. TABEL UTAMA: Pengeluaran
-- Tabel ini menyimpan data transaksi dasar
CREATE TABLE IF NOT EXISTS Pengeluaran (
    PengeluaranID INT AUTO_INCREMENT PRIMARY KEY,
    nominal INT NOT NULL,
    keterangan VARCHAR(255),
    tanggal DATE NOT NULL,
    metode_pembayaran VARCHAR(50) NOT NULL
);

-- 4. TABEL PENDUKUNG: Kategori
-- Dihubungkan dengan PengeluaranID. 
-- ON DELETE CASCADE memastikan jika transaksi dihapus, kategorinya ikut terhapus otomatis.
CREATE TABLE IF NOT EXISTS Kategori (
    KategoriID INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    PengeluaranID INT UNIQUE,
    FOREIGN KEY (PengeluaranID)
        REFERENCES Pengeluaran(PengeluaranID)
        ON DELETE CASCADE
);

-- =============================================
-- DATA DUMMY AWAL (UNTUK DEMO SISTEM & TEST SEARCH)
-- =============================================
INSERT IGNORE INTO Pengeluaran (PengeluaranID, nominal, keterangan, tanggal, metode_pembayaran) VALUES
(1, 25000, 'Makan siang Nasi Padang', '2026-04-12', 'Cash'),
(2, 11000, 'Bayar Parkir Kampus UMY', '2026-04-12', 'Cash'),
(3, 75000, 'Top Up saldo e-money', '2026-04-13', 'Bank/Transfer'),
(4, 50000, 'Beli Kuota Internet', '2026-04-13', 'Bank/Transfer');

INSERT IGNORE INTO Kategori (nama_kategori, PengeluaranID) VALUES
('Makanan', 1),
('Transportasi', 2),
('Top Up', 3),
('Internet', 4);