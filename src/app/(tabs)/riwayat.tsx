// src/app/(tabs)/riwayat.tsx
// UTS: Fitur Riwayat Pencarian Terakhir + Hapus Cache per Kota

import { useState, useCallback } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  ambilRiwayatPencarian,
  hapusItemRiwayat,
  hapusSemuaRiwayat,
  ItemRiwayat,
} from "../../services/riwayatPencarian";
import {
  daftarKotaTersimpan,
  hapusCacheKota,
} from "../../services/cacheRepository";
import { KotaFavorit } from "../../types/favorit";
import { RingkasanKotaTersimpan } from "../../types/cache";
import { useAppTheme } from "../../context/ThemeContext";

type TabAktif = "favorit" | "riwayat" | "cache";

export default function TabRiwayat() {
  const { warna, isDark } = useAppTheme();
  const [tabAktif, setTabAktif] = useState<TabAktif>("favorit");
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [daftarRiwayat, setDaftarRiwayat] = useState<ItemRiwayat[]>([]);
  const [daftarCache, setDaftarCache] = useState<RingkasanKotaTersimpan[]>([]);

  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
      ambilRiwayatPencarian().then(setDaftarRiwayat);
      daftarKotaTersimpan().then(setDaftarCache);
    }, [])
  );

  // ── Favorit ──────────────────────────────────────────────────────────────
  function konfirmasiHapusFavorit(kota: KotaFavorit) {
    if (Platform.OS === "web") {
      if (window.confirm(`Yakin hapus ${kota.nama} dari favorit?`)) {
        proseHapusFavorit(kota.id);
      }
    } else {
      Alert.alert("Hapus Favorit", `Yakin hapus ${kota.nama} dari favorit?`, [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => proseHapusFavorit(kota.id),
        },
      ]);
    }
  }

  async function proseHapusFavorit(id: number) {
    await hapusFavorit(id);
    setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
  }

  // ── Riwayat Pencarian ─────────────────────────────────────────────────────
  function bukaPencarian(item: ItemRiwayat) {
    // Navigasi ke beranda dan picu pencarian kota
    router.push({
      pathname: "/",
      params: {
        riwayat_id: String(item.id),
        riwayat_nama: item.nama,
        riwayat_lat: String(item.latitude),
        riwayat_lon: String(item.longitude),
      },
    });
  }

  function konfirmasiHapusRiwayat(item: ItemRiwayat) {
    if (Platform.OS === "web") {
      if (window.confirm(`Hapus "${item.nama}" dari riwayat?`)) {
        hapusItemRiwayat(item.id).then(() =>
          setDaftarRiwayat((prev) => prev.filter((r) => r.id !== item.id))
        );
      }
    } else {
      Alert.alert("Hapus Riwayat", `Hapus "${item.nama}" dari riwayat?`, [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            await hapusItemRiwayat(item.id);
            setDaftarRiwayat((prev) => prev.filter((r) => r.id !== item.id));
          },
        },
      ]);
    }
  }

  function konfirmasiHapusSemua() {
    if (Platform.OS === "web") {
      if (window.confirm("Hapus semua riwayat pencarian?")) {
        hapusSemuaRiwayat().then(() => setDaftarRiwayat([]));
      }
    } else {
      Alert.alert("Hapus Semua", "Hapus semua riwayat pencarian?", [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: async () => {
            await hapusSemuaRiwayat();
            setDaftarRiwayat([]);
          },
        },
      ]);
    }
  }

  // ── Cache Kota ─────────────────────────────────────────────────────────────
  function konfirmasiHapusCache(kota: RingkasanKotaTersimpan) {
    if (Platform.OS === "web") {
      if (
        window.confirm(
          `Hapus cache cuaca "${kota.nama}" dari perangkat?\n\nData ini dibutuhkan untuk melihat cuaca secara offline.`
        )
      ) {
        prosesHapusCache(kota.kunci, kota.nama);
      }
    } else {
      Alert.alert(
        "Hapus Cache Kota",
        `Hapus cache cuaca "${kota.nama}" dari perangkat?\n\nData ini dibutuhkan untuk melihat cuaca secara offline.`,
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus Cache",
            style: "destructive",
            onPress: () => prosesHapusCache(kota.kunci, kota.nama),
          },
        ]
      );
    }
  }

  async function prosesHapusCache(kunci: string, nama: string) {
    await hapusCacheKota(kunci);
    setDaftarCache((prev) => prev.filter((k) => k.kunci !== kunci));
    if (Platform.OS !== "web") {
      Alert.alert("Berhasil", `Cache "${nama}" telah dihapus.`);
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function formatTanggal(ts: number) {
    const d = new Date(ts);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const s = makeStyles(warna, isDark);

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={s.container}>
      {/* ── Pill Tab Switcher ─────────────────────────────────────────── */}
      <View style={s.tabBar}>
        {(
          [
            { key: "favorit", label: "⭐ Favorit" },
            { key: "riwayat", label: "🕐 Riwayat" },
            { key: "cache", label: "💾 Cache" },
          ] as { key: TabAktif; label: string }[]
        ).map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={[s.tabItem, tabAktif === key && s.tabItemAktif]}
            onPress={() => setTabAktif(key)}
          >
            <Text
              style={[
                s.tabLabel,
                tabAktif === key && s.tabLabelAktif,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll}>
        {/* ═══════════════ TAB FAVORIT ════════════════ */}
        {tabAktif === "favorit" && (
          <View>
            <Text style={s.judul}>Kota Favorit</Text>
            <Text style={s.sub}>Tersimpan {daftarFavorit.length} kota</Text>

            {daftarFavorit.length === 0 ? (
              <View style={s.kosong}>
                <Ionicons name="heart-outline" size={48} color={warna.textSecondary} />
                <Text style={s.kosongTeks}>Belum ada kota favorit</Text>
              </View>
            ) : (
              daftarFavorit.map((kota) => (
                <View key={kota.id} style={s.kartu}>
                  <View style={s.kartuKiri}>
                    <Ionicons name="location" size={18} color="#4F8EF7" />
                    <Text style={s.namaKota}>{kota.nama}</Text>
                  </View>
                  <TouchableOpacity
                    style={s.tombolHapus}
                    onPress={() => konfirmasiHapusFavorit(kota)}
                    accessibilityLabel={`Hapus ${kota.nama} dari favorit`}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        {/* ═══════════════ TAB RIWAYAT ════════════════ */}
        {tabAktif === "riwayat" && (
          <View>
            <View style={s.headerRow}>
              <View>
                <Text style={s.judul}>Riwayat Pencarian</Text>
                <Text style={s.sub}>
                  {daftarRiwayat.length} dari 10 pencarian terakhir
                </Text>
              </View>
              {daftarRiwayat.length > 0 && (
                <TouchableOpacity
                  style={s.tombolHapusSemua}
                  onPress={konfirmasiHapusSemua}
                >
                  <Ionicons name="trash" size={14} color="#fff" />
                  <Text style={s.tombolHapusSemuaTeks}>Hapus Semua</Text>
                </TouchableOpacity>
              )}
            </View>

            {daftarRiwayat.length === 0 ? (
              <View style={s.kosong}>
                <Ionicons name="time-outline" size={48} color={warna.textSecondary} />
                <Text style={s.kosongTeks}>Belum ada riwayat pencarian</Text>
              </View>
            ) : (
              daftarRiwayat.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={s.kartu}
                  onPress={() => bukaPencarian(item)}
                >
                  <View style={s.kartuKiri}>
                    <Ionicons name="search" size={16} color="#4F8EF7" />
                    <View>
                      <Text style={s.namaKota}>{item.nama}</Text>
                      <Text style={s.subTeks}>{formatTanggal(item.dicariPada)}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={s.tombolHapus}
                    onPress={() => konfirmasiHapusRiwayat(item)}
                    accessibilityLabel={`Hapus riwayat ${item.nama}`}
                  >
                    <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* ═══════════════ TAB CACHE ════════════════ */}
        {tabAktif === "cache" && (
          <View>
            <Text style={s.judul}>Cache Kota Tersimpan</Text>
            <Text style={s.sub}>
              Data cuaca offline — {daftarCache.length} kota
            </Text>

            {daftarCache.length === 0 ? (
              <View style={s.kosong}>
                <Ionicons name="cloud-offline-outline" size={48} color={warna.textSecondary} />
                <Text style={s.kosongTeks}>Tidak ada cache kota tersimpan</Text>
              </View>
            ) : (
              daftarCache.map((kota) => (
                <View key={kota.kunci} style={s.kartu}>
                  <View style={s.kartuKiri}>
                    <Ionicons name="cloud-done" size={18} color="#10B981" />
                    <View>
                      <Text style={s.namaKota}>{kota.nama}</Text>
                      <Text style={s.subTeks}>
                        Disimpan: {formatTanggal(kota.disimpanPada)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={s.tombolHapus}
                    onPress={() => konfirmasiHapusCache(kota)}
                    accessibilityLabel={`Hapus cache ${kota.nama}`}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
function makeStyles(warna: any, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: warna.background,
    },
    tabBar: {
      flexDirection: "row",
      margin: 16,
      backgroundColor: isDark ? "#1a1a1a" : "#f0f0f0",
      borderRadius: 12,
      padding: 4,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 10,
    },
    tabItemAktif: {
      backgroundColor: isDark ? "#2a2a2a" : "#fff",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: "500",
      color: warna.textSecondary,
    },
    tabLabelAktif: {
      color: "#4F8EF7",
      fontWeight: "700",
    },
    scroll: {
      padding: 16,
      paddingTop: 0,
      gap: 10,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4,
    },
    judul: {
      fontSize: 18,
      fontWeight: "bold",
      color: warna.text,
      marginBottom: 2,
    },
    sub: {
      fontSize: 12,
      color: warna.textSecondary,
      marginBottom: 12,
    },
    kartu: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: isDark ? "#1c1c1e" : "#f8f9fa",
      borderRadius: 12,
      padding: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: isDark ? "#2c2c2e" : "#e9ecef",
    },
    kartuKiri: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flex: 1,
    },
    namaKota: {
      fontSize: 15,
      fontWeight: "600",
      color: warna.text,
    },
    subTeks: {
      fontSize: 11,
      color: warna.textSecondary,
      marginTop: 2,
    },
    tombolHapus: {
      padding: 6,
    },
    tombolHapusSemua: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#EF4444",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
    },
    tombolHapusSemuaTeks: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },
    kosong: {
      alignItems: "center",
      paddingVertical: 40,
      gap: 12,
    },
    kosongTeks: {
      color: warna.textSecondary,
      fontSize: 14,
    },
  });
}