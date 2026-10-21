// src/db/database.web.ts
// Versi web: expo-sqlite tidak tersedia di browser (butuh WebAssembly yang
// tidak didukung Metro bundler).
// Semua panggilan database di-shim sebagai no-op agar bundling web berhasil.
// Fitur favorit, riwayat pencarian, dan tema tetap berjalan via AsyncStorage.

export type MockDB = {
  runAsync: (...args: unknown[]) => Promise<void>;
  getFirstAsync: <T>(...args: unknown[]) => Promise<T | null>;
  getAllAsync: <T>(...args: unknown[]) => Promise<T[]>;
  execAsync: (...args: unknown[]) => Promise<void>;
};

const mockDB: MockDB = {
  runAsync: async () => {},
  getFirstAsync: async () => null,
  getAllAsync: async () => [],
  execAsync: async () => {},
};

export function ambilDatabase(): Promise<MockDB> {
  return Promise.resolve(mockDB);
}
