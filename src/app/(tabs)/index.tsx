// src/app/(tabs)/index.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SearchBox from "../../../components/SearchBox";
import WeatherCard from "../../../components/WeatherCard";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import StatusData from "../../components/StatusData";
import { useDebounce } from "../../hooks/use-debounce";
import { cariKota } from "../../services/geocodingService";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
} from "../../services/cacheRepository";
import {
  mintaIzinLokasi,
  ambilKoordinatSaatIni,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { HasilGeocoding } from "../../types/geocoding";
import { HasilCuacaOffline, RingkasanKotaTersimpan } from "../../types/cache";
import { tambahRiwayatPencarian } from "../../services/riwayatPencarian";
import { ambilSemuaFavorit } from "../../services/favoritStorage";
import { useAppTheme } from "../../context/ThemeContext";

export default function HalamanUtama() {
  const { warna, isDark } = useAppTheme();
  const params = useLocalSearchParams<{
    riwayat_id?: string;
    riwayat_nama?: string;
    riwayat_lat?: string;
    riwayat_lon?: string;
  }>();

  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [idKotaFavorit, setIdKotaFavorit] = useState<number[]>([]);
  const [kotaTersimpan, setKotaTersimpan] = useState<
    RingkasanKotaTersimpan[]
  >([]);
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);

  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;
      ambilSemuaFavorit()
        .then((favorit) => {
          if (aktif) setIdKotaFavorit(favorit.map((kota) => kota.id));
        })
        .catch((error) => {
          console.error("Gagal memuat daftar kota favorit:", error);
        });

      return () => {
        aktif = false;
      };
    }, [])
  );

  // Tangani navigasi dari tab Riwayat (klik item riwayat pencarian)
  useEffect(() => {
    if (
      params.riwayat_id &&
      params.riwayat_nama &&
      params.riwayat_lat &&
      params.riwayat_lon
    ) {
      pilihKota({
        id: Number(params.riwayat_id),
        name: params.riwayat_nama,
        latitude: Number(params.riwayat_lat),
        longitude: Number(params.riwayat_lon),
        country: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.riwayat_id]);

  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }
    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    setKotaTerpilih(kota);
    setHasilPencarian([]);
    setTeksCari("");
    const idSaatIni = ++requestIdRef.current;
    setSedangMemuat(true);
    setPesanError(null);
    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui }
      );
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(data);
      muatKotaTersimpan();
      // Simpan ke riwayat pencarian (hanya kota yang berhasil dimuat, id > 0)
      if (kota.id > 0) {
        tambahRiwayatPencarian(kota).catch(() => {});
      }
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi."
      );
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas."
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual."
      );
      return;
    }
    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  const s = makeStyles(warna, isDark);
  const kotaSudahFavorit = kotaTerpilih
    ? idKotaFavorit.includes(kotaTerpilih.id)
    : false;

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={s.container}>
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search */}
        <SearchBox onCari={setTeksCari} />

        {/* Tombol Lokasi */}
        <TouchableOpacity style={s.tombolLokasi} onPress={gunakanLokasiSaatIni}>
          <Ionicons name="location-sharp" size={16} color="#fff" />
          <Text style={s.tombolLokasiTeks}>Gunakan Lokasi Saat Ini</Text>
        </TouchableOpacity>

        {pesanLokasi && (
          <Text style={s.pesanLokasi} accessibilityLabel={pesanLokasi}>
            {pesanLokasi}
          </Text>
        )}

        {/* Hasil Pencarian Dropdown */}
        {hasilPencarian.length > 0 && (
          <View style={s.dropdown}>
            {hasilPencarian.map((kota) => (
              <TouchableOpacity
                key={kota.id}
                style={s.dropdownItem}
                onPress={() => pilihKota(kota)}
              >
                <Ionicons name="search" size={14} color={warna.textSecondary} />
                <Text style={s.dropdownTeks}>{kota.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Kota Tersimpan (Cache) */}
        {kotaTersimpan.length > 0 && (
          <View style={s.seksi}>
            <Text style={s.judulSeksi}>
              Tersimpan di perangkat (bisa dibuka offline)
            </Text>
            {kotaTersimpan.map((k) => (
              <TouchableOpacity
                key={k.kunci}
                style={s.kartuKota}
                onPress={() =>
                  pilihKota({
                    id: k.id,
                    name: k.nama,
                    latitude: k.latitude,
                    longitude: k.longitude,
                    country: "",
                  })
                }
              >
                <Ionicons name="cloud-done" size={16} color="#10B981" />
                <Text style={s.kotaNama}>{k.nama}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={warna.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Loading */}
        {sedangMemuat && (
          <View style={s.loadingBox}>
            <ActivityIndicator color="#4F8EF7" />
            <Text style={s.loadingTeks}>Memuat data cuaca...</Text>
          </View>
        )}

        {/* Error */}
        {pesanError && (
          <View style={s.errorBox}>
            <Ionicons name="wifi-outline" size={24} color="#EF4444" />
            <Text style={s.errorTeks} accessibilityLabel={pesanError}>
              {pesanError}
            </Text>
            <TouchableOpacity
              style={s.tombolCoba}
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            >
              <Text style={s.tombolCobaTeks}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Hasil Cuaca */}
        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca?.saatIni?.suhu ?? 0}
              tingkatAQI={konversiTingkatAQI(
                hasil.kualitasUdara?.indeksAQI ?? 0
              )}
            />
            <View style={s.infoCuaca}>
              <Text style={s.infoTeks}>
                Kondisi:{" "}
                <Text style={{ fontWeight: "600" }}>
                  {labelKodeCuaca(hasil.cuaca?.saatIni?.kodeCuaca ?? 0)}
                </Text>
              </Text>
              <Text style={s.infoTeks}>
                Angin:{" "}
                <Text style={{ fontWeight: "600" }}>
                  {hasil.cuaca?.saatIni?.kecepatanAngin ?? 0} km/j
                </Text>
              </Text>
            </View>

            <View style={s.tombolRow}>
              <TouchableOpacity
                style={[s.tombolAksi, { backgroundColor: "#4F8EF7" }]}
                onPress={() => pilihKota(kotaTerpilih, true)}
              >
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={s.tombolAksiTeks}>Perbarui</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  s.tombolAksi,
                  {
                    backgroundColor: kotaSudahFavorit ? "#9CA3AF" : "#F59E0B",
                  },
                ]}
                disabled={kotaSudahFavorit}
                accessibilityState={{ disabled: kotaSudahFavorit }}
                onPress={() =>
                  router.push({
                    pathname: "/tambah-favorit",
                    params: {
                      id: String(kotaTerpilih.id),
                      nama: kotaTerpilih.name,
                      lat: String(kotaTerpilih.latitude),
                      lon: String(kotaTerpilih.longitude),
                    },
                  })
                }
              >
                <Ionicons name="heart" size={16} color="#fff" />
                <Text style={s.tombolAksiTeks}>Favorit</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(warna: any, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: warna.background,
    },
    scroll: {
      padding: 16,
      gap: 14,
    },
    tombolLokasi: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: "#4F8EF7",
      padding: 12,
      borderRadius: 12,
    },
    tombolLokasiTeks: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
    pesanLokasi: {
      color: "#EF4444",
      fontSize: 13,
      textAlign: "center",
    },
    dropdown: {
      backgroundColor: isDark ? "#1c1c1e" : "#fff",
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? "#2c2c2e" : "#e0e0e0",
      overflow: "hidden",
    },
    dropdownItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      padding: 14,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#2c2c2e" : "#f0f0f0",
    },
    dropdownTeks: {
      fontSize: 14,
      color: warna.text,
    },
    seksi: {
      gap: 8,
    },
    judulSeksi: {
      fontSize: 13,
      fontWeight: "700",
      color: warna.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    kartuKota: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: isDark ? "#1c1c1e" : "#f8f9fa",
      padding: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: isDark ? "#2c2c2e" : "#e9ecef",
    },
    kotaNama: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: warna.text,
    },
    loadingBox: {
      alignItems: "center",
      gap: 10,
      paddingVertical: 20,
    },
    loadingTeks: {
      color: warna.textSecondary,
      fontSize: 13,
    },
    errorBox: {
      alignItems: "center",
      gap: 10,
      backgroundColor: isDark ? "#2a1a1a" : "#FEF2F2",
      padding: 16,
      borderRadius: 12,
    },
    errorTeks: {
      color: "#EF4444",
      fontSize: 13,
      textAlign: "center",
    },
    tombolCoba: {
      backgroundColor: "#EF4444",
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 8,
    },
    tombolCobaTeks: {
      color: "#fff",
      fontWeight: "700",
    },
    infoCuaca: {
      backgroundColor: isDark ? "#1c1c1e" : "#f8f9fa",
      padding: 12,
      borderRadius: 10,
      gap: 4,
    },
    infoTeks: {
      fontSize: 13,
      color: warna.textSecondary,
    },
    tombolRow: {
      flexDirection: "row",
      gap: 12,
    },
    tombolAksi: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: 12,
      borderRadius: 12,
    },
    tombolAksiTeks: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
  });
}