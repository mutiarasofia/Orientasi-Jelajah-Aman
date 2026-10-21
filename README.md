# Laporan Pengerjaan UTS — Jelajah Aman
## UTS Pemrograman Berbasis Platform
**Nama:** Mutiara Sofia Ramadhani | **NIM:** 60324083

---

## Tugas 1: Kustomisasi Ikon Tab Bar & Perbaikan Label Navigasi

**File diubah:** [`src/app/(tabs)/_layout.tsx`](file:///d:/EXPO/orientasi-jelajah-aman/src/app/(tabs)/_layout.tsx)

### Yang dikerjakan:
- Mengganti ikon segitiga default dengan ikon **Ionicons** dari `@expo/vector-icons`
- Setiap tab memiliki ikon **filled** (saat aktif) dan **outline** (saat tidak aktif):
  | Tab | Ikon Aktif | Ikon Tidak Aktif |
  |---|---|---|
  | Beranda | `home` | `home-outline` |
  | Riwayat | `heart` | `heart-outline` |
  | Pengaturan | `settings` | `settings-outline` |
  | Tentang | `information-circle` | `information-circle-outline` |
- Label navigasi diperjelas: "Riwayat" (fungsi favorit & riwayat) dan "Tentang Aplikasi" (sebagai header)
- Tab bar & header warna menyesuaikan tema aktif (gelap/terang)

---

## Tugas 2: Fitur Riwayat Pencarian Terakhir (Recent Search History)

**File baru:** [`src/services/riwayatPencarian.ts`](file:///d:/EXPO/orientasi-jelajah-aman/src/services/riwayatPencarian.ts)  
**File diubah:** [`src/app/(tabs)/riwayat.tsx`](file:///d:/EXPO/orientasi-jelajah-aman/src/app/(tabs)/riwayat.tsx) | [`src/app/(tabs)/index.tsx`](file:///d:/EXPO/orientasi-jelajah-aman/src/app/(tabs)/index.tsx)

### Yang dikerjakan:
- Service `riwayatPencarian.ts` menyimpan riwayat ke **AsyncStorage** (key: `@jelajah_aman:riwayat_pencarian`)
- Maks **10 pencarian terakhir** — entri ke-11 otomatis menghapus yang paling lama
- **Deduplikasi**: jika kota yang sama dicari lagi, entri lama dihapus dan diganti yang baru di atas
- Riwayat ditampilkan di tab **Riwayat → sub-tab "🕐 Riwayat"**
- Klik item riwayat → otomatis navigasi ke Beranda dan memuat data kota tersebut
- Setiap item dapat dihapus satu per satu atau sekaligus (dengan tombol "Hapus Semua")

---

## Tugas 3: Penghapusan Cache Kota per Item

**File diubah:** [`src/services/cacheRepository.ts`](file:///d:/EXPO/orientasi-jelajah-aman/src/services/cacheRepository.ts) | [`src/app/(tabs)/riwayat.tsx`](file:///d:/EXPO/orientasi-jelajah-aman/src/app/(tabs)/riwayat.tsx)

### Yang dikerjakan:
- Fungsi baru `hapusCacheKota(kunci)` di `cacheRepository.ts` — hapus cache satu kota berdasarkan kunci koordinat
- Tab **Riwayat → sub-tab "💾 Cache"** menampilkan semua kota yang tersimpan di cache SQLite
- Setiap item cache memiliki **tombol hapus** (ikon trash merah)
- Konfirmasi **Alert** muncul sebelum cache dihapus (mendukung Android/iOS dengan `Alert.alert` dan Web dengan `window.confirm`)
- Pesan sukses ditampilkan setelah cache berhasil dihapus

---

## Tugas 4: Implementasi Tema Gelap / Terang (Dark / Light Mode)

**File baru:** [`src/context/ThemeContext.tsx`](file:///d:/EXPO/orientasi-jelajah-aman/src/context/ThemeContext.tsx)  
**File diubah:** [`src/app/_layout.tsx`](file:///d:/EXPO/orientasi-jelajah-aman/src/app/_layout.tsx) | [`src/app/(tabs)/pengaturan.tsx`](file:///d:/EXPO/orientasi-jelajah-aman/src/app/(tabs)/pengaturan.tsx) + semua halaman lain

### Yang dikerjakan:
- **Context global** `ThemeContext` yang menyimpan preferensi tema ke AsyncStorage (persisten)
- Tiga pilihan di halaman **Pengaturan → Mode Tampilan**:
  - ☀️ **Terang** — selalu tema putih/cerah
  - 🌙 **Gelap** — selalu tema hitam/gelap
  - 📱 **Ikuti Sistem** — mengikuti pengaturan OS perangkat
- Semua halaman (Beranda, Riwayat, Pengaturan, Tentang) menerapkan warna tema secara dinamis
- Tab bar dan header juga berubah mengikuti tema aktif

---

## Ringkasan File yang Dibuat/Diubah

| File | Status | Keterangan |
|------|--------|------------|
| `src/services/riwayatPencarian.ts` | 🆕 Baru | Service riwayat pencarian AsyncStorage |
| `src/context/ThemeContext.tsx` | 🆕 Baru | Context tema global |
| `src/services/cacheRepository.ts` | ✏️ Diubah | Tambah `hapusCacheKota()` |
| `src/app/_layout.tsx` | ✏️ Diubah | Tambah ThemeProvider |
| `src/app/(tabs)/_layout.tsx` | ✏️ Diubah | Ikon tab bar + warna tema |
| `src/app/(tabs)/index.tsx` | ✏️ Diubah | Simpan riwayat + tema + UI |
| `src/app/(tabs)/riwayat.tsx` | ✏️ Diubah | 3 sub-tab + riwayat + hapus cache |
| `src/app/(tabs)/pengaturan.tsx` | ✏️ Diubah | Pilihan tema + hapus data |
| `src/app/(tabs)/tentang.tsx` | ✏️ Diubah | Tampilan kartu + dukungan tema |