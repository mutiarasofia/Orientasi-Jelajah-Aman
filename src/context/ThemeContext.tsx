// src/context/ThemeContext.tsx
// Context global untuk mengatur tema Terang, Gelap, atau Ikuti Sistem

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../constants/theme";

export type PilihanTema = "terang" | "gelap" | "sistem";
type WarnaTema = (typeof Colors.light) | (typeof Colors.dark);

interface ThemeContextType {
  pilihanTema: PilihanTema;
  setPilihanTema: (pilihan: PilihanTema) => void;
  tema: "light" | "dark";
  warna: WarnaTema;
  isDark: boolean;
}

const KUNCI_TEMA = "@jelajah_aman:tema";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const sistemSkema = useSystemColorScheme();
  const [pilihanTema, setPilihanTemaState] = useState<PilihanTema>("sistem");

  // Muat preferensi tema dari AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem(KUNCI_TEMA).then((val) => {
      if (val === "terang" || val === "gelap" || val === "sistem") {
        setPilihanTemaState(val);
      }
    });
  }, []);

  async function setPilihanTema(pilihan: PilihanTema) {
    setPilihanTemaState(pilihan);
    await AsyncStorage.setItem(KUNCI_TEMA, pilihan);
  }

  // Tentukan tema aktif berdasarkan pilihan
  let tema: "light" | "dark";
  if (pilihanTema === "terang") {
    tema = "light";
  } else if (pilihanTema === "gelap") {
    tema = "dark";
  } else {
    // "sistem"
    tema = sistemSkema === "dark" ? "dark" : "light";
  }

  const warna = Colors[tema];
  const isDark = tema === "dark";

  return (
    <ThemeContext.Provider
      value={{ pilihanTema, setPilihanTema, tema, warna, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme harus digunakan di dalam ThemeProvider");
  }
  return ctx;
}
