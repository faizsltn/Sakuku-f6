-- =============================================
-- DATABASE SAKUKU F6 - 
-- =============================================

-- Membuat Database jika belum ada
CREATE DATABASE IF NOT EXISTS sakuku_db;
USE sakuku_db;

-- =============================================
-- 1. TABEL USER (Identity Management & Recovery)
-- =============================================
-- Menambahkan kolom security_answer untuk fitur Lupa Password
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    security_answer VARCHAR(255) NOT NULL, -- Nama Ibu Kandung
    role ENUM('admin', 'customer') DEFAULT 'customer'
);

-- Data Akun Default untuk Simulasi
-- Admin: Jawaban Keamanan "aminah"
-- Faiz: Jawaban Keamanan "siti"
INSERT IGNORE INTO users (username, email, password, security_answer, role) VALUES 
('admin', 'admin@sakuku.com', 'admin123', 'aminah', 'admin'),
('faiz', 'faiz@mail.com', 'faiz123', 'siti', 'customer');

-- =============================================
-- 2. TABEL UTAMA: Pengeluaran
-- =============================================
CREATE TABLE IF NOT EXISTS Pengeluaran (
    PengeluaranID INT AUTO_INCREMENT PRIMARY KEY,
    nominal INT NOT NULL,
    keterangan VARCHAR(255),
    tanggal DATE NOT NULL,
    metode_pembayaran VARCHAR(50) NOT NULL
);

-- =============================================
-- 3. TABEL PENDUKUNG: Kategori
-- =============================================
CREATE TABLE IF NOT EXISTS Kategori (
    KategoriID INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    PengeluaranID INT UNIQUE,
    FOREIGN KEY (PengeluaranID)
        REFERENCES Pengeluaran(PengeluaranID)
        ON DELETE CASCADE
);

-- =============================================
-- DATA DUMMY AWAL (UNTUK DEMO SISTEM)
-- =============================================
INSERT IGNORE INTO Pengeluaran (PengeluaranID, nominal, keterangan, tanggal, metode_pembayaran) VALUES
(1, 25000, 'Makan siang', '2026-01-01', 'Cash'),
(2, 10000, 'Parkir kampus', '2026-01-02', 'Cash'),
(3, 75000, 'Belanja bulanan', '2026-01-03', 'Bank');

INSERT IGNORE INTO Kategori (nama_kategori, PengeluaranID) VALUES
('Makanan', 1),
('Transportasi', 2),
('Kebutuhan', 3);