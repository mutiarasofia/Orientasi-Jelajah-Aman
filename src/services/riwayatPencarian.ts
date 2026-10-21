// src/services/riwayatPencarian.ts
// Service untuk menyimpan riwayat pencarian kota (maks 10) ke AsyncStorage

import AsyncStorage from "@react-native-async-storage/async-storage";
import { HasilGeocoding } from "../types/geocoding";

const KUNCI_RIWAYAT = "@jelajah_aman:riwayat_pencarian";
const MAKS_RIWAYAT = 10;

export interface ItemRiwayat {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
  country: string;
  dicariPada: number; // timestamp
}

export async function ambilRiwayatPencarian(): Promise<ItemRiwayat[]> {
  const json = await AsyncStorage.getItem(KUNCI_RIWAYAT);
  return json ? JSON.parse(json) : [];
}

export async function tambahRiwayatPencarian(
  kota: HasilGeocoding
): Promise<void> {
  const riwayat = await ambilRiwayatPencarian();

  // Hapus entri lama jika kota yang sama sudah ada
  const tanpaDuplikat = riwayat.filter((item) => item.id !== kota.id);

  // Tambahkan di awal (terbaru duluan) dan batasi maks 10
  const riwayatBaru: ItemRiwayat[] = [
    {
      id: kota.id,
      nama: kota.name,
      latitude: kota.latitude,
      longitude: kota.longitude,
      country: kota.country,
      dicariPada: Date.now(),
    },
    ...tanpaDuplikat,
  ].slice(0, MAKS_RIWAYAT);

  await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(riwayatBaru));
}

export async function hapusItemRiwayat(id: number): Promise<void> {
  const riwayat = await ambilRiwayatPencarian();
  const riwayatBaru = riwayat.filter((item) => item.id !== id);
  await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(riwayatBaru));
}

export async function hapusSemuaRiwayat(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI_RIWAYAT);
}
