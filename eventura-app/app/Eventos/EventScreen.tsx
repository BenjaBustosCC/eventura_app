import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TouchableOpacity } from 'react-native';
import EventCard from './EventCard';
import { fetchEventosByUserId, deleteEvento } from '../../services/eventService';
import { authService } from '../../services/authService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Evento = {
  id?: number | string;
  nombre?: string;
  titulo?: string;
  nombre_evento?: string;
  fecha?: string;
  imagen?: string;
  id_estado?: number | null;
  id_usuario?: number | string;
};

type RootStackParamList = {
  EditEventScreen: { evento: Evento };
};

export default function EventScreen() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventoAEliminar, setEventoAEliminar] = useState<Evento | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<{ id: number | string } | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Obtener usuario autenticado al montar
  useEffect(() => {
    authService.getCurrentUser().then(setUser);
  }, []);

  // Cargar eventos del usuario cada vez que la vista recibe foco
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
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
    }, [])
  );

  // Manejar eliminación
  const handleDelete = (evento: Evento) => {
    setEventoAEliminar(evento);
    setModalVisible(true);
  };

  const confirmarEliminacion = async () => {
    const id = eventoAEliminar?.id;
    if (!id) return;
    setModalVisible(false);
    setLoading(true);
    try {
      await deleteEvento(id);
      setEventos(prev => prev.filter(ev => ev.id !== id));
      Alert.alert('Éxito', 'Evento eliminado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo eliminar el evento');
    } finally {
      setLoading(false);
      setEventoAEliminar(null);
    }
  };

// Agrupa los eventos por estado
const pendientes = eventos.filter(e => e.id_estado === 1 || e.id_estado == null);
const aprobados = eventos.filter(e => e.id_estado === 2);
const rechazados = eventos.filter(e => e.id_estado === 3);
const finalizados = eventos.filter(e => e.id_estado === 4);

// Crea una lista combinada con secciones
const dataWithSections = [
  ...(pendientes.length > 0 ? [{ section: "Pendientes de aprobación" }, ...pendientes] : []),
  ...(aprobados.length > 0 ? [{ section: "Aprobados" }, ...aprobados] : []),
  ...(rechazados.length > 0 ? [{ section: "Rechazados" }, ...rechazados] : []),
  ...(finalizados.length > 0 ? [{ section: "Finalizados" }, ...finalizados] : []),
];
  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#ff9800" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tus eventos</Text>
      <FlatList
        data={dataWithSections}
        keyExtractor={(item, idx) =>
          item.section ? `section-${item.section}` : item.id?.toString() || Math.random().toString()
        }
        renderItem={({ item }) => {
          if (item.section) {
            return (
              <Text style={styles.sectionTitle}>{item.section}</Text>
            );
          }
          return (
            <EventCard
              nombre={item.titulo || item.nombre_evento || item.nombre || 'Evento sin nombre'}
              fecha={item.fecha || ''}
              imagen={item.imagen}
              id_estado={item.id_estado}
              onDelete={() => handleDelete(item)}
              onEdit={() =>
                navigation.navigate('EditEventScreen', {
                  evento: {
                    ...item,
                    id_usuario: item.id_usuario ?? user?.id,
                  },
                })
              }
            />
          );
        }}
        ListEmptyComponent={<Text>No tienes eventos.</Text>}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal de confirmación */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>
              ¿Seguro que deseas eliminar este evento?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#d32f2f' }]}
                onPress={confirmarEliminacion}
                activeOpacity={0.7}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ff9800', marginLeft: 8 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  containerLoading: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#333",
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});