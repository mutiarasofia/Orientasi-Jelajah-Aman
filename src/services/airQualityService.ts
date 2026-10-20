// src/services/airQualityService.ts
import { DataKualitasUdara } from "../types/weather";

const BASE_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export async function ambilKualitasUdara(
  latitude: number,
  longitude: number
): Promise<DataKualitasUdara> {
  const url = `${BASE_URL}?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm10,pm2_5`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Gagal mengambil data kualitas udara");
  }

  const data = await response.json();

  return {
    indeksAQI: data.current.us_aqi ?? 0,
    pm25: data.current.pm2_5 ?? 0,
    pm10: data.current.pm10 ?? 0,
  };
}   