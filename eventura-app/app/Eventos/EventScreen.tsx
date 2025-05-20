import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import EventCard from './EventCard';
import { fetchEventosByUserId } from '../../services/eventService';
import { authService } from '../../services/authService';

type Evento = {
  id_evento?: number | string;
  nombre?: string;
  titulo?: string;
  nombre_evento?: string;
  fecha?: string;
  imagen?: string;
};

export default function EventScreen() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  authService.getCurrentUser().then(user => {
    if (user && user.id) {
      fetchEventosByUserId(user.id)
        .then(data => {
          setEventos(data);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  });
}, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ff9800" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus eventos</Text>
      <FlatList
  data={eventos}
  keyExtractor={item => item.id_evento?.toString() || Math.random().toString()}
  renderItem={({ item }) => (
    <EventCard
      nombre={item.titulo || item.nombre_evento || item.nombre || 'Evento sin nombre'}
      fecha={item.fecha || ''}
      imagen={item.imagen}
    />
  )}
  ListEmptyComponent={<Text>No tienes eventos.</Text>}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
});