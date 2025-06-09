import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchTiposEvento, updateEvento } from '../../services/eventService';

type EditEventFormProps = {
  evento: any;
  onSuccess?: () => void;
};

export default function EditEventForm({ evento, onSuccess }: EditEventFormProps) {
  const [nombre, setNombre] = useState(evento.nombre_evento || '');
  const [descripcion, setDescripcion] = useState(evento.descripcion_evento || '');
  const [lugar, setLugar] = useState(evento.lugar_evento || '');
  const [fecha, setFecha] = useState(new Date(evento.fecha_evento));
  const [horaInicio, setHoraInicio] = useState(new Date(`${evento.fecha_evento}T${evento.hora_inicio_evento}`));
  const [horaTermino, setHoraTermino] = useState(new Date(`${evento.fecha_evento}T${evento.hora_termino_evento}`));
  const [tipoEventoId, setTipoEventoId] = useState(String(evento.id_tipo_evento));
  const [tiposEvento, setTiposEvento] = useState<{ id: number | string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoraInicio, setShowHoraInicio] = useState(false);
  const [showHoraTermino, setShowHoraTermino] = useState(false);

  useEffect(() => {
    fetchTiposEvento()
      .then(data => {
        setTiposEvento(data);
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', 'No se pudieron cargar los tipos de evento');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    try {
      await updateEvento(evento.id_evento, {
        nombre_evento: nombre,
        descripcion_evento: descripcion,
        fecha_evento: fecha.toISOString().split('T')[0],
        hora_inicio_evento: horaInicio.toTimeString().slice(0, 5),
        hora_termino_evento: horaTermino.toTimeString().slice(0, 5),
        lugar_evento: lugar,
        id_usuario: evento.id_usuario,
        id_tipo_evento: tipoEventoId,
      });
      Alert.alert('Éxito', 'Evento actualizado correctamente');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'No se pudo actualizar el evento');
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

      <Text style={styles.label}>Lugar</Text>
      <TextInput
        style={styles.input}
        value={lugar}
        onChangeText={setLugar}
        placeholder="Lugar del evento"
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
      <View style={styles.picker}>
        {tiposEvento.map(tipo => (
          <TouchableOpacity
            key={tipo.id}
            style={[
              styles.pickerItem,
              tipoEventoId === tipo.id && styles.pickerItemSelected,
            ]}
            onPress={() => setTipoEventoId(String(tipo.id))}
          >
            <Text style={tipoEventoId === tipo.id ? styles.pickerTextSelected : styles.pickerText}>
              {tipo.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Actualizar Evento" onPress={handleSubmit} />
    </ScrollView>
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
});