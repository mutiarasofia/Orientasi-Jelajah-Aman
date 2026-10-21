// metro.config.js
// Konfigurasi Metro Bundler — redirect expo-sqlite ke mock saat platform web
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Tambahkan .wasm sebagai asset extension
if (!config.resolver.assetExts.includes("wasm")) {
  config.resolver.assetExts.push("wasm");
}

// Simpan resolver asli
const defaultResolver = config.resolver.resolveRequest;

/**
 * Saat platform=web, arahkan SEMUA import expo-sqlite (termasuk
 * web/worker.ts dan wa-sqlite.wasm) ke mock no-op agar bundling berhasil.
 * Database.web.ts menggantikan database.ts secara platform-specific,
 * namun expo-sqlite sendiri masih bisa di-resolve oleh dependency lain.
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === "web" &&
    (moduleName === "expo-sqlite" ||
      moduleName.startsWith("expo-sqlite/") ||
      // tangkap import internal dari dalam node_modules expo-sqlite
      context.originModulePath.includes(
        path.join("node_modules", "expo-sqlite")
      ))
  ) {
    // Kembalikan mock database agar tidak ada yang di-bundle dari expo-sqlite
    return {
      filePath: path.resolve(__dirname, "src/db/database.web.ts"),
      type: "sourceFile",
    };
  }

  // Untuk semua lainnya, gunakan resolver default
  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
