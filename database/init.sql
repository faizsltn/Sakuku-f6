-- Membuat Tabel Utama: Pengeluaran
CREATE TABLE IF NOT EXISTS Pengeluaran (
    PengeluaraID INT AUTO_INCREMENT PRIMARY KEY, --
    nominal DECIMAL(10, 2) NOT NULL, --
    keterangan TEXT, --
    tanggal DATE NOT NULL, --
    metode_pembayaran VARCHAR(50) --
);

-- Membuat Tabel Pendukung: Kategori
CREATE TABLE IF NOT EXISTS Kategori (
    Kategori_id INT AUTO_INCREMENT PRIMARY KEY, --
    nama_kategori VARCHAR(100) NOT NULL, --
    PengeluaraID INT UNIQUE, -- Foreign Key
    FOREIGN KEY (PengeluaraID) REFERENCES Pengeluaran(PengeluaraID) ON DELETE CASCADE --
);