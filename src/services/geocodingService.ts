import AsyncStorage from "@react-native-async-storage/async-storage";
import { GeocodingResponse, HasilGeocoding } from "../types/geocoding";

const BASE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const KEY_CACHE_PENCARIAN = "CACHE_HASIL_PENCARIAN";

export async function cariKota(nama: string): Promise<HasilGeocoding[]> {
  if (!nama.trim()) return [];

  const url = `${BASE_URL}?name=${encodeURIComponent(nama)}&count=5&language=id&format=json`;

  try {
    // 1. Coba ambil dari API Open-Meteo saat ONLINE
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Gagal memuat data (status ${response.status})`);
    }

    const data: GeocodingResponse = await response.json();
    const hasil = data.results ?? [];

    if (hasil.length > 0) {
      // Simpan/perbarui riwayat pencarian kota ke AsyncStorage untuk offline nanti
      await simpanRiwayatKota(hasil);
    }

    return hasil;
  } catch (error) {
    console.warn("Koneksi terputus, mengambil dari riwayat pencarian lokal...");
  }

  // 2. Jika OFFLINE: Cari dari riwayat kota yang pernah tersimpan di AsyncStorage
  const riwayatLokal = await ambilRiwayatKota();
  return riwayatLokal.filter((kota) =>
    kota.name.toLowerCase().includes(nama.toLowerCase())
  );
}

// Helper untuk menyimpan riwayat kota unik
async function simpanRiwayatKota(kotaBaru: HasilGeocoding[]) {
  try {
    const riwayatLama = await ambilRiwayatKota();
    const gabungan = [...riwayatLama, ...kotaBaru];

    // Filter agar ID kota tidak ganda
    const riwayatUnik = Array.from(
      new Map(gabungan.map((item) => [item.id, item])).values()
    );

    await AsyncStorage.setItem(KEY_CACHE_PENCARIAN, JSON.stringify(riwayatUnik));
  } catch {
    // Abaikan error penyimpanan
  }
}

// Helper untuk membaca riwayat kota
async function ambilRiwayatKota(): Promise<HasilGeocoding[]> {
  try {
    const data = await AsyncStorage.getItem(KEY_CACHE_PENCARIAN);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}