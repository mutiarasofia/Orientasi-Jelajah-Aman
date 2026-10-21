// src/app/(tabs)/tentang.tsx
import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../context/ThemeContext";

export default function TentangScreen() {
  const { warna, isDark } = useAppTheme();
  const s = makeStyles(warna, isDark);

  return (
    <SafeAreaView
      edges={["bottom", "left", "right"]}
      style={s.container}
      accessible={true}
    >
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Header */}
        <View style={s.headerBox}>
          <View style={s.ikonAplikasi}>
            <Ionicons name="earth" size={48} color="#fff" />
          </View>
          <Text
            style={s.title}
            accessible={true}
            accessibilityLabel="Judul Halaman: Tentang Aplikasi"
          >
            Jelajah Aman
          </Text>
          <Text style={s.tagline}>
            Aplikasi monitoring cuaca berbasis platform
          </Text>
        </View>

        {/* Info Aplikasi */}
        <View style={s.kartu}>
          <Text style={s.judulKartu}>Informasi Aplikasi</Text>

          {[
            { label: "Nama Aplikasi", nilai: "Jelajah Aman" },
            { label: "Versi", nilai: "1.0.0" },
            { label: "Platform", nilai: "Expo / React Native" },
          ].map(({ label, nilai }) => (
            <View key={label} style={s.baris}>
              <Text style={s.barisLabel}>{label}</Text>
              <Text style={s.barisNilai}>{nilai}</Text>
            </View>
          ))}
          <View style={s.deskripsiBox}>
            <Text style={s.barisLabel}>Deskripsi Singkat</Text>
            <Text style={s.deskripsiAplikasi}>
              Jelajah Aman membantu memantau informasi cuaca dan kualitas udara
              di berbagai kota, mencari kondisi berdasarkan lokasi, serta
              menyimpan data agar tetap dapat diakses secara offline.
            </Text>
          </View>
        </View>

        {/* Pembuat */}
        <View style={s.kartu}>
          <Text style={s.judulKartu}>Pembuat</Text>
          <View style={s.profileBox}>
            <View style={s.avatarBox}>
              <Ionicons name="person" size={28} color="#4F8EF7" />
            </View>
            <View>
              <Text style={s.namaPembuat}>Mutiara Sofia Ramadhani</Text>
            </View>
          </View>
          {[
            { label: "Mata Kuliah", nilai: "Pemrograman Berbasis Platform" },
            { label: "Program Studi", nilai: "S1 Informatika" },
            { label: "Institusi", nilai: "UIN K.H. Abdurrahman Wahid Pekalongan" },
          ].map(({ label, nilai }) => (
            <View key={label} style={s.baris}>
              <Text style={s.barisLabel}>{label}</Text>
              <Text style={s.barisNilai}>{nilai}</Text>
            </View>
          ))}
        </View>

        {/* Fitur */}
        <View style={s.kartu}>
          <Text style={s.judulKartu}>Fitur Utama</Text>
          {[
            "🌤️ Monitoring cuaca real-time via Open-Meteo",
            "💨 Indeks kualitas udara (AQI)",
            "📍 Deteksi lokasi otomatis",
            "💾 Mode offline dengan cache SQLite",
            "⭐ Daftar kota favorit",
            "🕐 Riwayat pencarian (maks 10)",
            "🌙 Tema Gelap / Terang / Sistem",
          ].map((fitur) => (
            <Text key={fitur} style={s.fiturItem}>
              {fitur}
            </Text>
          ))}
        </View>

        {/* API Attribution */}
        <View style={s.kartu}>
          <Text style={s.judulKartu}>Sumber Data</Text>
          <Text style={s.atribusi}>
            Data cuaca disediakan oleh{" "}
            <Text style={{ color: "#4F8EF7", fontWeight: "700" }}>
              Open-Meteo
            </Text>{" "}
            (open-meteo.com) — gratis untuk penggunaan non-komersial.
          </Text>
        </View>
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
      gap: 16,
    },
    headerBox: {
      alignItems: "center",
      paddingVertical: 24,
      gap: 8,
    },
    ikonAplikasi: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: "#4F8EF7",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      shadowColor: "#4F8EF7",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    title: {
      fontSize: 26,
      fontWeight: "800",
      color: warna.text,
    },
    tagline: {
      fontSize: 13,
      color: warna.textSecondary,
      textAlign: "center",
    },
    kartu: {
      backgroundColor: isDark ? "#1c1c1e" : "#f8f9fa",
      borderRadius: 16,
      padding: 16,
      gap: 8,
      borderWidth: 1,
      borderColor: isDark ? "#2c2c2e" : "#e9ecef",
    },
    judulKartu: {
      fontSize: 15,
      fontWeight: "700",
      color: warna.text,
      marginBottom: 4,
    },
    baris: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#2c2c2e" : "#eeeeee",
    },
    barisLabel: {
      fontSize: 13,
      color: warna.textSecondary,
      flex: 1,
    },
    barisNilai: {
      fontSize: 13,
      fontWeight: "600",
      color: warna.text,
      flex: 1,
      textAlign: "right",
    },
    deskripsiBox: {
      gap: 6,
      paddingTop: 6,
    },
    deskripsiAplikasi: {
      fontSize: 13,
      color: warna.text,
      lineHeight: 20,
    },
    profileBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
    },
    avatarBox: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: isDark ? "#1a2a3e" : "#EBF2FF",
      justifyContent: "center",
      alignItems: "center",
    },
    namaPembuat: {
      fontSize: 16,
      fontWeight: "700",
      color: warna.text,
    },
    subPembuat: {
      fontSize: 12,
      color: warna.textSecondary,
    },
    fiturItem: {
      fontSize: 13,
      color: warna.text,
      paddingVertical: 3,
    },
    atribusi: {
      fontSize: 13,
      color: warna.textSecondary,
      lineHeight: 20,
    },
  });
}