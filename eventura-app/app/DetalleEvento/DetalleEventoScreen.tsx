import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener esto instalado

type Evento = {
  imagen?: string;
  nombre?: string;
  titulo?: string;
  fecha?: string;
  fecha_evento?: string;
  lugar_evento?: string;
  lugar?: string;
  descripcion_evento?: string;
  descripcion?: string;
  hora_inicio_evento?: string;
  hora_inicio?: string;
  hora_termino_evento?: string;
  hora_termino?: string;
  tipo_evento_nombre?: string;
  tipo?: string;
  id_tipo_evento?: string;
};

type RouteParams = {
  evento?: Evento;
};

export default function DetalleEventoScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const { evento } = (route as any).params || {};

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
      : 'https://via.placeholder.com/600x400/ff9800/ffffff?text=Evento';

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
          <Ionicons name="calendar" size={20} color="#ff9800" />
          <Text style={styles.infoText}>{evento.fecha || evento.fecha_evento || 'Sin fecha'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={20} color="#ff9800" />
          <Text style={styles.infoText}>{evento.lugar_evento || evento.lugar || 'Sin lugar'}</Text>
        </View>

        <Text style={styles.sectionLabel}>Descripción</Text>
        <Text style={styles.sectionText}>
          {evento.descripcion_evento || evento.descripcion || 'Sin descripción'}
        </Text>

        <Text style={styles.sectionLabel}>Hora de inicio</Text>
        <Text style={styles.sectionText}>
          {evento.hora_inicio_evento || evento.hora_inicio || 'Sin hora'}
        </Text>

        <Text style={styles.sectionLabel}>Hora de término</Text>
        <Text style={styles.sectionText}>
          {evento.hora_termino_evento || evento.hora_termino || 'Sin hora'}
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
    height: 260,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 16,
    backgroundColor: '#ff3d00',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 24,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff9800',
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
  sectionLabel: {
    fontSize: 16,
    color: '#ff9800',
    fontWeight: 'bold',
    marginTop: 16,
  },
  sectionText: {
    fontSize: 15,
    color: '#333',
    marginTop: 4,
  },
});
