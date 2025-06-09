import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

type HomeCardProps = {
  nombre: string;
  fecha: string;
  imagen?: string;
  descripcion: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function HomeCard({ nombre, fecha, imagen, descripcion, onEdit, onDelete }: HomeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: imagen || 'https://via.placeholder.com/100x100/ff9800/ffffff?text=Evento' }}
          style={styles.imagen}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.descripcion}>{descripcion}</Text>
          <Text style={styles.fecha}>{fecha}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.buttonTextDelete}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ff9800',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    width: 340,
    alignItems: 'flex-start',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#fff',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'left',
  },
  fecha: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'left',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-start',
  },
  editButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  buttonTextDelete: {
    color: '#fff',
    fontWeight: 'bold',
  },
  descripcion: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
    textAlign: 'left',
  },
});