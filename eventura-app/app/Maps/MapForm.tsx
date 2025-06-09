import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import MapView, { Region, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from './styles';
import { fetchEventos } from '../../services/eventService';

type Event = {
  id: string;
  nombre_evento: string;
  latitud: number;
  longitud: number;
};

export default function MapForm() {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación.');
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });

        const data = await fetchEventos();

        const validEvents = data.filter((event: Event) =>
          event.latitud != null &&
          event.longitud != null &&
          typeof event.latitud === 'number' &&
          !isNaN(event.latitud) &&
          typeof event.longitud === 'number' &&
          !isNaN(event.longitud)
        );

        setEvents(validEvents);

        setLoading(false);
      } catch (error) {
        console.error('Error al obtener ubicación o eventos', error);
        Alert.alert('Error', 'No se pudieron cargar los eventos');
        setLoading(false);
      }
    })();
  }, []);

  console.log('Eventos:', events);
  if (loading || !region) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
      style={styles.map}
      region={region}
      showsUserLocation
      showsMyLocationButton
    >
      {events.map(event => (
        <Marker
          key={event.id}
          coordinate={{
            latitude: event.latitud,
            longitude: event.longitud
          }}
          title={event.nombre_evento}
        />
      ))}
    </MapView>
    </View>
  );
}
