import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditarEvento'>;

export default function EditScreen({ route, navigation }: Props) {
  const { id } = route.params;

  // Simula cargar datos del evento según id, luego setea estados
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    // Aquí iría la lógica para traer los datos del evento, por ejemplo API
    // Ejemplo simulado:
    const fetchEvent = async () => {
      // Simula datos traídos
      const eventData = {
        title: 'Evento de prueba',
        location: 'Ciudad XYZ',
        description: 'Descripción del evento',
        date: '2025-06-10',
      };
      setTitle(eventData.title);
      setLocation(eventData.location);
      setDescription(eventData.description);
      setDate(eventData.date);
    };
    fetchEvent();
  }, [id]);

  const handleSave = () => {
    const updatedEvent = {
      id,
      title,
      location,
      description,
      date,
    };
    // Aquí haces el update real (API, estado global, etc)
    console.log('Evento actualizado:', updatedEvent);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Lugar:</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>Descripción:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Fecha:</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} />

      <Button title="Guardar cambios" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 5,
    marginTop: 5,
  },
});
