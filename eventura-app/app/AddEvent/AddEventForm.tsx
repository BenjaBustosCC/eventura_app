import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView, Image, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

export default function AddEventForm({
  nombre, setNombre,
  descripcion, setDescripcion,
  lugar, setLugar,
  fecha, setFecha,
  horaInicio, setHoraInicio,
  horaTermino, setHoraTermino,
  tipoEventoId, setTipoEventoId,
  tiposEvento,
  showDatePicker, setShowDatePicker,
  showHoraInicio, setShowHoraInicio,
  showHoraTermino, setShowHoraTermino,
  handleSubmit,
  loading,
  imagen, setImagen,
  sugerencias, setSugerencias,
  buscarLugares,
  obtenerCoordenadas,
}: any) {
  const [picking, setPicking] = useState(false);
  const googleRef = useRef<any>(null);

  const pickImage = async () => {
    setPicking(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.7,
    });
    setPicking(false);
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setImagen(result.assets[0].base64);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando tipos de evento...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
          setLugar(data.description);
          if (details?.geometry?.location) {
            obtenerCoordenadas && obtenerCoordenadas(details.place_id);
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

      <Text style={styles.label}>Lugar</Text>
      <TextInput
        style={styles.input}
        value={lugar}
        onChangeText={setLugar}
        placeholder="Lugar del evento"
      />

      <Text style={styles.label}>Fecha del Evento</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        <Text>{fecha.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setFecha(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Hora de Inicio</Text>
      <TouchableOpacity
        onPress={() => setShowHoraInicio(true)}
        style={styles.input}
      >
        <Text>
          {horaInicio.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      {showHoraInicio && (
        <DateTimePicker
          value={horaInicio}
          mode="time"
          is24Hour
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedTime) => {
            setShowHoraInicio(false);
            if (selectedTime) setHoraInicio(selectedTime);
          }}
        />
      )}

      <Text style={styles.label}>Hora de Término</Text>
      <TouchableOpacity
        onPress={() => setShowHoraTermino(true)}
        style={styles.input}
      >
        <Text>
          {horaTermino.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
      {showHoraTermino && (
        <DateTimePicker
          value={horaTermino}
          mode="time"
          is24Hour
          display={Platform.OS === "ios" ? "spinner" : "default"}
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
          {tiposEvento.map((tipo: { id: string | number; nombre: string }) => (
            <Picker.Item key={tipo.id} label={tipo.nombre} value={tipo.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Imagen del Evento</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={picking}>
        <Text style={{ color: '#ff9800', textAlign: 'center' }}>
          {imagen ? 'Cambiar imagen' : 'Seleccionar imagen'}
        </Text>
      </TouchableOpacity>
      {imagen ? (
        <Image
          source={{ uri: imagen.startsWith('data:image') ? imagen : `data:image/jpeg;base64,${imagen}` }}
          style={styles.imagePreview}
        />
      ) : null}

      <Button title="Crear Evento" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ff9800",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#fff7e6",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff7e6',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#ff9800',
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#fff7e6",
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
});