import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './styles';

type EventCardProps = {
  id: string;
  nombre: string;
  fecha: string;
  imagen?: string;
  descripcion: string;
  onDelete?: () => void;
    onEdit: () => void;

  onPress?: () => void; // ✅ Nueva prop para manejar navegación desde el padre
};

export default function EventCard({
  id,
  nombre,
  fecha,
  imagen,
  descripcion,
  onDelete,
  onPress,
}: EventCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          defaultSource={require("../../assets/default-image.png")} // opcional si usas imagen local
          style={styles.imagen}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.nombre}>{nombre}</Text>
          <Text style={styles.descripcion}>{descripcion}</Text>
          <Text style={styles.fecha}>{fecha}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editButton} onPress={onPress}>
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
