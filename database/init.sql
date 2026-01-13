-- =========================
-- TABEL UTAMA: Pengeluaran
-- =========================
CREATE TABLE Pengeluaran (
    PengeluaranID INT AUTO_INCREMENT PRIMARY KEY,
    nominal INT NOT NULL,
    keterangan VARCHAR(255),
    tanggal DATE NOT NULL,
    metode_pembayaran VARCHAR(50) NOT NULL
);

-- =========================
-- TABEL PENDUKUNG: Kategori
-- =========================
CREATE TABLE Kategori (
    KategoriID INT AUTO_INCREMENT PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    PengeluaranID INT UNIQUE,
    FOREIGN KEY (PengeluaranID)
        REFERENCES Pengeluaran(PengeluaranID)
        ON DELETE CASCADE
);

-- =========================
-- DATA DUMMY AWAL (UNTUK DEMO)
-- =========================
INSERT INTO Pengeluaran (nominal, keterangan, tanggal, metode_pembayaran) VALUES
(25000, 'Makan siang', '2026-01-01', 'Cash'),
(10000, 'Parkir kampus', '2026-01-02', 'Cash'),
(75000, 'Belanja bulanan', '2026-01-03', 'Bank');

INSERT INTO Kategori (nama_kategori, PengeluaranID) VALUES
('Makanan', 1),
('Transportasi', 2),
('Kebutuhan', 3);