import { View, Text, TouchableOpacity, Linking } from "react-native";

interface AtribusiCuacaProps {
  pm25?: number;
  pm10?: number;
}

export default function AtribusiCuaca({ pm25, pm10 }: AtribusiCuacaProps) {
  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      {/* Teks kecil PM2.5 dan PM10 */}
      {(pm25 !== undefined || pm10 !== undefined) && (
        <Text style={{ fontSize: 11, color: "#666" }}>
          PM2.5: {pm25 ?? "-"} µg/m³ | PM10: {pm10 ?? "-"} µg/m³
        </Text>
      )}

      {/* Teks Atribusi Utama */}
      <TouchableOpacity onPress={() => Linking.openURL("https://open-meteo.com/")}>
        <Text style={{ fontSize: 11, color: "#888", textAlign: "center" }}>
          Data cuaca disediakan oleh Open-Meteo.com
        </Text>
      </TouchableOpacity>
    </View>
  );
}