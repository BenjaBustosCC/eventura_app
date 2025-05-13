// app/CrearEvento/CrearForm.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import styles from './styles';

interface CrearFormProps {
  onPublicar: (titulo: string, descripcion: string, fecha: string, imagen: string | null) => void;
}

const CrearForm: React.FC<CrearFormProps> = ({ onPublicar }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');

  const handlePublicar = () => {
    if (!titulo || !descripcion || !fecha) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    onPublicar(titulo, descripcion, fecha, null); // imagen null si no se cambia desde aquí
  };

  return (
    <View style={styles.form}>
      <TextInput
        placeholder="Título"
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        placeholder="Descripción"
        style={[styles.input, styles.descriptionInput]}
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        style={styles.input}
        value={fecha}
        onChangeText={setFecha}
      />
      <TouchableOpacity style={styles.publishButton} onPress={handlePublicar}>
        <Text style={styles.publishText}>Publicar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CrearForm;