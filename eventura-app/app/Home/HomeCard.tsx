import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

type HomeCardProps = {
  nombre: string;
  fecha: string;
  imagen?: string;
};

export default function HomeCard({ nombre, fecha, imagen }: HomeCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: imagen || 'https://via.placeholder.com/200x120/ff9800/ffffff?text=Evento' }} // Placeholder image
        style={styles.imagen}
        resizeMode="cover"
      />
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.fecha}>{fecha}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#BB271A',
    borderRadius: 16,
    padding: 24,
    marginVertical: 8,
    width: 340,
    height: 340,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imagen: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  fecha: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
});