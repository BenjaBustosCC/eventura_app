import React from 'react';
import { Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

type HomeCardProps = {
  nombre: string;
  fecha: string;
  imagen?: string;
  onPress?: () => void;
};

export default function HomeCard({ nombre, fecha, imagen, onPress }: HomeCardProps) {
  // Asegura el prefijo base64 si es necesario
  const imageUri =
  imagen && typeof imagen === 'string' && imagen.length > 0
    ? imagen
    : 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fethic.es%2F2023%2F03%2Fel-enigma-de-la-imagen%2F&psig=AOvVaw1cCTIoadcAHZZ-LP8xywAd&ust=1749574911325000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJiPk8ro5I0DFQAAAAAdAAAAABAE';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={{ uri: imageUri }}
        style={styles.imagen}
        resizeMode="cover"
      />
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.fecha}>{fecha}</Text>
    </TouchableOpacity>
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