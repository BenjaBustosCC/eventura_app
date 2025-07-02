import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp, userRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type Evento = {
  imagen?: string;
  nombre?: string;
  titulo?: string;
  fecha?: string;
  fecha_evento?: string;
  lugar_evento?: string;
  descripcion_evento?: string;
  descripcion?: string;
  hora_inicio_evento?: string;
  hora_inicio?: string;
  hora_termino_evento?: string;
  hora_termino?: string;
  tipo_evento_nombre?: string;
  tipo?: string;
  id_tipo_evento?: string;
  latitud?: number;
  longitud?: number;
};

type RootStackParamList = {
  DetalleEventoScreen: { evento: Evento };
  
};

export default function DetalleEventoScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'DetalleEventoScreen'>>();
  const { evento } = route.params;
  const navigation = useNavigation();
  
  if (!evento) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>No se encontró información del evento.</Text>
      </View>
    );
  }

  const imageUri =
    evento.imagen && typeof evento.imagen === 'string' && evento.imagen.length > 0
      ? evento.imagen
      : 'https://via.placeholder.com/600x400/BB271A/ffffff?text=Evento';

  // Definir variable lugar para mayor claridad
  const lugar = evento.lugar_evento || evento.lugar || 'Sin lugar';

  // Función para abrir la ubicación en Google Maps
  const handleOpenMap = () => {
    if (
      evento.latitud !== undefined && evento.latitud !== null &&
      evento.longitud !== undefined && evento.longitud !== null
    ) {
      const url = `https://www.google.com/maps/search/?api=1&query=${evento.latitud},${evento.longitud}`;
      Linking.openURL(url);
    } else {
      Alert.alert('Ubicación no disponible', 'No hay coordenadas disponibles para este evento.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Imagen con botón de volver */}
      <View style={styles.headerContainer}>
        <Image source={{ uri: imageUri }} style={styles.headerImage} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Contenido del evento */}
      <View style={styles.content}>
        <Text style={styles.titulo}>{evento.nombre || evento.titulo || 'Evento sin nombre'}</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={20} color="#BB271A" />
          <Text style={styles.infoText}>{evento.fecha || evento.fecha_evento || 'Sin fecha'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#BB271A" />
          <Text style={styles.infoText}>{lugar}</Text>
        </View>
        {/* Botón fuera del infoRow para evitar problemas de layout */}
        {evento.latitud !== undefined && evento.latitud !== null &&
         evento.longitud !== undefined && evento.longitud !== null && (
          <TouchableOpacity
            style={styles.mapButton}
            onPress={handleOpenMap}
          >
            <Ionicons name="map" size={20} color="#fff" />
            <Text style={styles.mapButtonText}>Ver en Google Maps</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionLabel}>Descripción</Text>
        <Text style={styles.sectionText}>
          {evento.descripcion_evento || evento.descripcion || 'Sin descripción'}
        </Text>

        <Text style={styles.sectionLabel}>Tipo de evento</Text>
        <Text style={styles.sectionText}>
          {evento.tipo_evento_nombre || evento.tipo || evento.id_tipo_evento || 'Sin tipo'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 400,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 16,
    backgroundColor: '#BB271A',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#BB271A',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BB271A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 0,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  mapButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 16,
    color: '#BB271A',
    fontWeight: 'bold',
    marginTop: 16,
  },
  sectionText: {
    fontSize: 15,
    color: '#333',
    marginTop: 4,
  },
});