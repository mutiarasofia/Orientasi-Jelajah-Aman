// src/app/(tabs)/pengaturan.tsx
// UTS: Implementasi Tema Gelap / Terang (Dark / Light Mode)

import { useState } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { hapusSemuaCache } from "../../services/cacheRepository";
import { hapusSemuaRiwayat } from "../../services/riwayatPencarian";
import { useAppTheme, PilihanTema } from "../../context/ThemeContext";

interface PilihanTemaItem {
  nilai: PilihanTema;
  label: string;
  deskripsi: string;
  ikon: keyof typeof Ionicons.glyphMap;
}

const PILIHAN_TEMA: PilihanTemaItem[] = [
  {
    nilai: "terang",
    label: "Terang",
    deskripsi: "Selalu gunakan tema terang",
    ikon: "sunny",
  },
  {
    nilai: "gelap",
    label: "Gelap",
    deskripsi: "Selalu gunakan tema gelap",
    ikon: "moon",
  },
  {
    nilai: "sistem",
    label: "Ikuti Sistem",
    deskripsi: "Mengikuti pengaturan perangkat",
    ikon: "phone-portrait-outline",
  },
];

export default function TabPengaturan() {
  const { pilihanTema, setPilihanTema, warna, isDark } = useAppTheme();
  const [pesan, setPesan] = useState<string | null>(null);

  async function hapusDataCuaca() {
    const lakukan = async () => {
      await hapusSemuaCache();
      setPesan("✅ Data cuaca tersimpan sudah dihapus.");
    };

    if (Platform.OS === "web") {
      if (window.confirm("Yakin ingin menghapus semua data cuaca tersimpan?")) {
        await lakukan();
      }
    } else {
      Alert.alert(
        "Hapus Data Cuaca",
        "Yakin ingin menghapus semua data cuaca tersimpan? Data offline tidak akan tersedia hingga terhubung ke internet kembali.",
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus", style: "destructive", onPress: lakukan },
        ]
      );
    }
  }

  async function hapusDataRiwayat() {
    const lakukan = async () => {
      await hapusSemuaRiwayat();
      setPesan("✅ Riwayat pencarian sudah dihapus.");
    };

    if (Platform.OS === "web") {
      if (window.confirm("Yakin ingin menghapus semua riwayat pencarian?")) {
        await lakukan();
      }
    } else {
      Alert.alert(
        "Hapus Riwayat",
        "Yakin ingin menghapus semua riwayat pencarian?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Hapus", style: "destructive", onPress: lakukan },
        ]
      );
    }
  }

  const s = makeStyles(warna, isDark);

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* ── Tema ──────────────────────────────────────────────────── */}
        <View style={s.seksi}>
          <Text style={s.judulSeksi}>Mode Tampilan</Text>
          <Text style={s.deskripsiSeksi}>
            Pilih tema aplikasi yang nyaman untuk Anda
          </Text>

          {PILIHAN_TEMA.map((item) => {
            const aktif = pilihanTema === item.nilai;
            return (
              <TouchableOpacity
                key={item.nilai}
                style={[s.pilihan, aktif && s.pilihanAktif]}
                onPress={() => setPilihanTema(item.nilai)}
                accessibilityLabel={`Mode ${item.label}`}
                accessibilityState={{ selected: aktif }}
              >
                <View style={[s.ikonContainer, aktif && s.ikonContainerAktif]}>
                  <Ionicons
                    name={item.ikon}
                    size={20}
                    color={aktif ? "#fff" : warna.textSecondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.labelPilihan, aktif && s.labelAktif]}>
                    {item.label}
                  </Text>
                  <Text style={s.deskripsiPilihan}>{item.deskripsi}</Text>
                </View>
                {aktif && (
                  <Ionicons name="checkmark-circle" size={22} color="#4F8EF7" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Data & Privasi ─────────────────────────────────────────── */}
        <View style={s.seksi}>
          <Text style={s.judulSeksi}>Data & Privasi</Text>

          <TouchableOpacity
            style={s.tombolDanger}
            onPress={hapusDataCuaca}
            accessibilityLabel="Hapus semua data cuaca"
          >
            <Ionicons name="cloud-offline-outline" size={18} color="#fff" />
            <Text style={s.tombolDangerTeks}>Hapus Semua Data Cuaca</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.tombolDanger, { marginTop: 8 }]}
            onPress={hapusDataRiwayat}
            accessibilityLabel="Hapus riwayat pencarian"
          >
            <Ionicons name="time-outline" size={18} color="#fff" />
            <Text style={s.tombolDangerTeks}>Hapus Riwayat Pencarian</Text>
          </TouchableOpacity>

          {pesan && (
            <View style={s.pesanBox}>
              <Text style={s.pesanTeks} accessibilityLabel={pesan}>
                {pesan}
              </Text>
            </View>
          )}
        </View>

        {/* ── Info Aplikasi ──────────────────────────────────────────── */}
        <View style={s.seksi}>
          <Text style={s.judulSeksi}>Tentang Aplikasi</Text>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Nama</Text>
            <Text style={s.infoNilai}>Jelajah Aman</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Versi</Text>
            <Text style={s.infoNilai}>1.0.0</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Tema aktif</Text>
            <Text style={s.infoNilai}>
              {pilihanTema === "terang"
                ? "☀️ Terang"
                : pilihanTema === "gelap"
                ? "🌙 Gelap"
                : "📱 Ikuti Sistem"}
            </Text>
          </View>
        </View>
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
    scroll: {
      padding: 16,
      gap: 20,
    },
    seksi: {
      backgroundColor: isDark ? "#1c1c1e" : "#f8f9fa",
      borderRadius: 16,
      padding: 16,
      gap: 10,
      borderWidth: 1,
      borderColor: isDark ? "#2c2c2e" : "#e9ecef",
    },
    judulSeksi: {
      fontSize: 16,
      fontWeight: "700",
      color: warna.text,
      marginBottom: 2,
    },
    deskripsiSeksi: {
      fontSize: 12,
      color: warna.textSecondary,
      marginBottom: 4,
    },
    pilihan: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      padding: 12,
      borderRadius: 12,
      backgroundColor: isDark ? "#2a2a2c" : "#fff",
      borderWidth: 2,
      borderColor: "transparent",
    },
    pilihanAktif: {
      borderColor: "#4F8EF7",
      backgroundColor: isDark ? "#1a2a3e" : "#EBF2FF",
    },
    ikonContainer: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: isDark ? "#3a3a3c" : "#e0e0e0",
      justifyContent: "center",
      alignItems: "center",
    },
    ikonContainerAktif: {
      backgroundColor: "#4F8EF7",
    },
    labelPilihan: {
      fontSize: 15,
      fontWeight: "600",
      color: warna.text,
    },
    labelAktif: {
      color: "#4F8EF7",
    },
    deskripsiPilihan: {
      fontSize: 12,
      color: warna.textSecondary,
      marginTop: 2,
    },
    tombolDanger: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      backgroundColor: "#EF4444",
      padding: 14,
      borderRadius: 12,
    },
    tombolDangerTeks: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
    pesanBox: {
      backgroundColor: isDark ? "#0a2e1a" : "#d1fae5",
      padding: 12,
      borderRadius: 10,
    },
    pesanTeks: {
      color: "#059669",
      fontWeight: "600",
      fontSize: 13,
      textAlign: "center",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#2c2c2e" : "#e9ecef",
    },
    infoLabel: {
      fontSize: 13,
      color: warna.textSecondary,
    },
    infoNilai: {
      fontSize: 13,
      fontWeight: "600",
      color: warna.text,
    },
  });
}