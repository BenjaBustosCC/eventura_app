import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Modal, TouchableOpacity } from 'react-native';
import EventCard from './EventCard';
import { fetchEventosByUserId, deleteEvento } from '../../services/eventService';
import { authService } from '../../services/authService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Evento = {
  descripcion: string;
  id_evento?: number | string;
  nombre?: string;
  titulo?: string;
  nombre_evento?: string;
  descripcion_evento?: string;
  fecha?: string;
  imagen?: string;
};

type RootStackParamList = {
  EditEventScreen: { evento: Evento };
  // Puedes agregar más screens aquí si lo necesitas
};

export default function EventScreen() {
  const insets = useSafeAreaInsets();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventoAEliminar, setEventoAEliminar] = useState<Evento | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
    const id = eventoAEliminar?.id_evento || eventoAEliminar?.id;
    if (!id) return;
    setModalVisible(false);
    setLoading(true);
    try {
      await deleteEvento(id);
      setEventos(prev => prev.filter(ev => (ev.id_evento || ev.id) !== id));
      Alert.alert('Éxito', 'Evento eliminado correctamente');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo eliminar el evento');
    } finally {
      setLoading(false);
      setEventoAEliminar(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#6200ee" />
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
            onDelete={() => handleDelete(item)}
            onEdit={() => navigation.navigate('EditEventScreen', { evento: item })}
          />
        )}
        ListEmptyComponent={<Text>No tienes eventos.</Text>}
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
    alignItems: "center",
    backgroundColor: "#fff",
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
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
