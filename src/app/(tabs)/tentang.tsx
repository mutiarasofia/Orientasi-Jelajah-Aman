import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { spacing, typeScale } from '../../constants/styles';

export default function TentangScreen() {
  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
        accessible={true}
        accessibilityLabel="Judul Halaman: Tentang Aplikasi"
      >
        Aplikasi Monitoring Cuaca
      </Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Versi:</Text>
        <Text style={styles.value}>1.0.0</Text>
        
        <Text style={styles.label}>Pembuat:</Text>
        <Text style={styles.value}>Mutiara Sofia</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.sedang,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: typeScale.judul,
    fontWeight: 'bold',
    marginBottom: spacing.sedang,
  },
  infoCard: {
    gap: spacing.kecil,
  },
  label: {
    fontSize: typeScale.isi,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: typeScale.isi,
    marginBottom: spacing.kecil,
  },
});