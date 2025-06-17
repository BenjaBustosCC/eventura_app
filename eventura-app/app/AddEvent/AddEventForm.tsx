import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchTiposEvento, createEvento } from '../../services/eventService';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Picker } from '@react-native-picker/picker';

type AddEventFormProps = {
  userId: number | string;
  onSuccess?: () => void;
};

export default function AddEventForm({ userId, onSuccess }: AddEventFormProps) {
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaTermino, setHoraTermino] = useState(new Date());
  const [tipoEventoId, setTipoEventoId] = useState('');
  const [tiposEvento, setTiposEvento] = useState<{ id: number | string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoraInicio, setShowHoraInicio] = useState(false);
  const [showHoraTermino, setShowHoraTermino] = useState(false);

  const [lugarEvento, setLugarEvento] = useState('');
  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);

  const [imagen, setImagen] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);

  const googleRef = useRef<any>(null);

  useEffect(() => {
    fetchTiposEvento()
      .then(data => {
        setTiposEvento(data);
        setTipoEventoId(data[0]?.id || '');
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', 'No se pudieron cargar los tipos de evento');
        setLoading(false);
      });
  }, []);

  // Selección y compresión de imagen
  const pickImage = async () => {
    setPicking(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: false,
      quality: 0.7,
    });
    setPicking(false);
    if (!result.canceled && result.assets && result.assets[0].uri) {
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 600 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      setImagen(manipResult.base64 || null);
    }
  };

  const handleSubmit = async () => {
    if (!lugarEvento || latitud === null || longitud === null) {
      Alert.alert('Error', 'Debes seleccionar un lugar válido');
      return;
    }

    try {
      await createEvento({
        nombre_evento: nombre,
        descripcion_evento: descripcion,
        fecha_evento: fecha.toISOString().split('T')[0],
        hora_inicio_evento: horaInicio.toTimeString().slice(0, 5),
        hora_termino_evento: horaTermino.toTimeString().slice(0, 5),
        lugar_evento: lugarEvento,
        latitud,
        longitud,
        id_usuario: userId,
        id_tipo_evento: tipoEventoId,
        imagen, // <-- imagen base64 comprimida
      });
      Alert.alert('Éxito', 'Evento creado correctamente');
      setNombre('');
      setDescripcion('');
      setLugarEvento('');
      setLatitud(null);
      setLongitud(null);
      setImagen(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el evento');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.label}>Nombre del Evento</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre del evento"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Descripción del evento"
        multiline
      />

      <Text style={styles.label}>Lugar del Evento</Text>
      <GooglePlacesAutocomplete
        ref={googleRef}
        placeholder="Buscar dirección"
        fetchDetails={true}
        onPress={(data, details = null) => {
          setLugarEvento(data.description);
          if (details?.geometry?.location) {
            setLatitud(details.geometry.location.lat);
            setLongitud(details.geometry.location.lng);
          }
        }}
        query={{
          key: 'AIzaSyD6w_NILALZTacu5qTPC2n0qUmI4isCUog',
          language: 'es',
        }}
        styles={{
          textInput: styles.input,
          listView: { backgroundColor: '#fff' },
        }}
      />

      <Text style={styles.label}>Fecha del Evento</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{fecha.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFecha(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Hora de Inicio</Text>
      <TouchableOpacity onPress={() => setShowHoraInicio(true)} style={styles.input}>
        <Text>{horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showHoraInicio && (
        <DateTimePicker
          value={horaInicio}
          mode="time"
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedTime) => {
            setShowHoraInicio(false);
            if (selectedTime) setHoraInicio(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Hora de Término</Text>
      <TouchableOpacity onPress={() => setShowHoraTermino(true)} style={styles.input}>
        <Text>{horaTermino.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showHoraTermino && (
        <DateTimePicker
          value={horaTermino}
          mode="time"
          is24Hour
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, selectedTime) => {
            setShowHoraTermino(false);
            if (selectedTime) setHoraTermino(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Tipo de Evento</Text>
<View style={styles.pickerContainer}>
  <Picker
    selectedValue={tipoEventoId}
    onValueChange={(itemValue) => setTipoEventoId(String(itemValue))}
    style={styles.picker}
  >
    {tiposEvento.map((tipo) => (
      <Picker.Item key={tipo.id} label={tipo.nombre} value={tipo.id} />
    ))}
  </Picker>
</View>

      <Text style={styles.label}>Imagen del Evento</Text>
      <TouchableOpacity style={styles.input} onPress={pickImage} disabled={picking}>
        <Text style={{ color: '#ff9800', textAlign: 'center' }}>
          {imagen ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </Text>
      </TouchableOpacity>
      {imagen ? (
        <Image
          source={{ uri: imagen.startsWith('data:image') ? imagen : `data:image/jpeg;base64,${imagen}` }}
          style={{ width: 120, height: 120, borderRadius: 8, alignSelf: 'center', marginBottom: 16 }}
        />
      ) : null}

      <Button title="Crear Evento" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff7e6',
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  pickerItem: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff9800',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff7e6',
  },
  pickerItemSelected: {
    backgroundColor: '#ff9800',
  },
  pickerText: {
    color: '#ff9800',
  },
  pickerTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pickerContainer: {
  borderWidth: 1,
  borderColor: '#ff9800',
  borderRadius: 8,
  marginBottom: 16,
  backgroundColor: '#fff7e6',
  overflow: 'hidden',
},
});