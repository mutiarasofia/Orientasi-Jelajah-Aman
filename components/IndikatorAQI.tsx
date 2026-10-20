import React from 'react';
import { LaporanUdara } from '../src/types/cuaca';

interface IndikatorAQIProps {
  data: LaporanUdara;
}

export const IndikatorAQI: React.FC<IndikatorAQIProps> = ({ data }) => {
  const getWarnaTingkat = (tingkat: string) => {
    switch (tingkat) {
      case 'BAIK':
        return '#2e7d32'; // Hijau
      case 'SEDANG':
        return '#ed6c02'; // Oranye
      case 'TIDAK_SEHAT':
        return '#d32f2f'; // Merah
      case 'BERBAHAYA':
        return '#9c27b0'; // Ungu
      default:
        return '#000000';
    }
  };

  const warnaTeks = getWarnaTingkat(data.tingkat);

  return (
    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', margin: '8px 0' }}>
      <h3>Kualitas Udara: {data.kota}</h3>
      <p>Indeks AQI: <strong>{data.indeksAQI}</strong></p>
      <p>
        Tingkat: <span style={{ color: warnaTeks, fontWeight: 'bold' }}>{data.tingkat}</span>
      </p>
      {data.diperbaruiPada && (
        <p style={{ fontSize: '12px', color: '#666' }}>
          Diperbarui: {data.diperbaruiPada}
        </p>
      )}
    </div>
  );
};