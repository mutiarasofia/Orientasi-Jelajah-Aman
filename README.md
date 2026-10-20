## Penjelasan Status Data Cuaca

- **Cache-Segar**: Data cuaca diambil dari penyimpanan lokal (SQLite) karena umurnya masih di bawah batas TTL (30 menit) sehingga tidak membutuhkan koneksi internet.
- **Cache-Basi**: Data cuaca diambil dari penyimpanan lokal sebagai cadangan karena koneksi internet terputus/gagal, meskipun umur datanya sudah melewati batas TTL.
- **First-Run Offline**: Kondisi saat aplikasi dibuka tanpa koneksi internet dan belum ada data tersimpan sama sekali di SQLite, sehingga aplikasi tidak dapat menampilkan cuaca dan menampilkan pesan error.
- **Pentingnya Label Status Data**: Label status data sangat penting bagi pengguna untuk memberikan transparansi mengenai dari mana data berasal dan seberapa mutakhir informasi cuaca yang sedang mereka lihat.