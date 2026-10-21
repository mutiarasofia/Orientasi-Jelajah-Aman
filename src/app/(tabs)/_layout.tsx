// app/(tabs)/_layout.tsx
// Tugas UTS 1: Kustomisasi Ikon Tab Bar menggunakan @expo/vector-icons
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../context/ThemeContext";

export default function TabLayout() {
  const { warna, isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#4F8EF7",
        tabBarInactiveTintColor: isDark ? "#888" : "#aaa",
        tabBarStyle: {
          backgroundColor: warna.background,
          borderTopColor: isDark ? "#333" : "#e0e0e0",
        },
        headerStyle: {
          backgroundColor: warna.background,
        },
        headerTintColor: warna.text,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarLabel: "Beranda",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Favorit & Riwayat",
          tabBarLabel: "Riwayat",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Pengaturan",
          tabBarLabel: "Pengaturan",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tentang"
        options={{
          title: "Tentang Aplikasi",
          tabBarLabel: "Tentang",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={
                focused ? "information-circle" : "information-circle-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
