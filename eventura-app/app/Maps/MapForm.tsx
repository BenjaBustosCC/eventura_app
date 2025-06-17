import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Alert, Image, Text } from 'react-native';
import MapView, { Region, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Slider from '@react-native-community/slider';
import styles from './styles';
import { fetchEventos } from '../../services/eventService';
import { useFocusEffect } from '@react-navigation/native';

type Event = {
  id: string | number;
  titulo: string;
  fecha: string;
  imagen?: string;
  latitud: number;
  longitud: number;
};

export default function MapForm() {
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [radioKm, setRadioKm] = useState(5);
  const brujulaIcon = require('../../assets/brujula.png');

  // función para calcular distancia entre coordenadas
  function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

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
      } catch (error) {
        console.error('Error al obtener ubicación', error);
        Alert.alert('Error', 'No se pudo obtener la ubicación');
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const cargarEventos = async () => {
        try {
          const data = await fetchEventos();

          const validEvents = data.filter(
            (event: any) =>
              event.latitud != null &&
              event.longitud != null &&
              event.latitud !== 0 &&
              event.longitud !== 0 &&
              typeof event.latitud === 'number' &&
              !isNaN(event.latitud) &&
              typeof event.longitud === 'number' &&
              !isNaN(event.longitud)
          ).map((event: any) => ({
            id: event.id,
            titulo: event.titulo,
            fecha: event.fecha,
            latitud: event.latitud,
            longitud: event.longitud,
            imagen: event.imagen,
          }));

          setEvents(validEvents);
          setLoading(false);
        } catch (error) {
          console.error('Error al obtener eventos', error);
          Alert.alert('Error', 'No se pudieron cargar los eventos');
          setLoading(false);
        }
      };

      cargarEventos();
    }, [])
  );

  if (loading || !region) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // filtrar eventos según el radio actual y la ubicación
  const eventosFiltrados = events.filter(event =>
    calcularDistanciaKm(region.latitude, region.longitude, event.latitud, event.longitud) <= radioKm
  );

  console.log("Eventos filtrados:", eventosFiltrados);
  return (
    <View style={styles.container}>
      <Text style={styles.referenciaTexto}>
        Mostrando eventos en un radio de {radioKm.toFixed(1)} km
      </Text>

      <MapView
        style={styles.map}
        region={region}
        showsUserLocation
        showsMyLocationButton
      >
        {eventosFiltrados.map(event => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: Number(event.latitud),
              longitude: Number(event.longitud),
            }}
            title={event.titulo}
            description={`${event.fecha}`}
          >
            <Image source={brujulaIcon} style={styles.brujulaIcon} />
          </Marker>
        ))}
      </MapView>

      <View style={styles.sliderContainer}>
        <Text>Radio de búsqueda: {radioKm.toFixed(1)} km</Text>
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={1}
          maximumValue={20}
          step={0.5}
          value={radioKm}
          onValueChange={setRadioKm}
          minimumTrackTintColor="#1EB1FC"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#1EB1FC"
        />
      </View>
    </View>
  );
}
