import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { fetchEventos } from '../../services/eventService';
import HomeCard from './HomeCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

type Evento = {
  id_evento?: number | string;
  nombre?: string;
  titulo?: string;
  fecha?: string;
  descripcion?: string;
  imagen?: string; // <-- agrega imagen aquí
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const handlePress = (id_evento: number | string) => {
    const eventoSeleccionado = eventos.find(ev => ev.id_evento === id_evento);
    if (eventoSeleccionado) {
      navigation.navigate('DetalleEventoScreen', { evento: eventoSeleccionado });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchEventos()
        .then((data) => {
          setEventos(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={eventos}
        keyExtractor={item => item.id_evento?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <HomeCard
            nombre={item.nombre || item.titulo || 'Evento sin nombre'}
            fecha={item.fecha || ''}
            imagen={item.imagen}
            onPress={() => {
              if (item.id_evento !== undefined) {
                handlePress(item.id_evento);
              }
            }}
          />
        )}
        ListEmptyComponent={<Text>No hay eventos disponibles.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderColor: "red",
    borderWidth: 1,
  },
  containerLoading: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
});
