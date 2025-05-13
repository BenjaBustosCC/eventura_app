import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';
import styles from './styles';

interface DateSelected {
  dateString: string;
}

const CrearForm = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [direccion, setDireccion] = useState<string | null>(null);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [horaInicio, setHoraInicio] = useState<Date | null>(null);
  const [mostrarHora, setMostrarHora] = useState(false);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permisos denegados', 'Se requiere acceso a la ubicación para continuar.');
        return;
      }

      const ubicacion = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = ubicacion.coords;

      setLocation({ latitude, longitude });

      const direccionObtenida = await obtenerDireccion(latitude, longitude);
      setDireccion(direccionObtenida);
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }
  };

  const obtenerDireccion = async (latitud: number, longitud: number) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude: latitud,
        longitude: longitud,
      });

      if (geocode.length > 0) {
        const direccion = geocode[0];
        const direccionCompleta = `${direccion.street || ''}, ${direccion.city || ''}, ${direccion.region || ''}, ${direccion.country || ''}`;
        return direccionCompleta;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener dirección:', error);
      return null;
    }
  };

  const toggleCalendar = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  const handleDateSelect = (date: DateSelected) => {
    setSelectedDate(date.dateString);
    setIsCalendarVisible(false);
  };

  // Función que maneja el cambio de hora
  const onHoraChange = (_event: any, selected?: Date) => {
    setMostrarHora(false);
    if (selected) {
      setHoraInicio(selected);
    }
  };

  return (
    <View style={styles.form}>
      <TextInput placeholder="Título" style={styles.input} />

      <TextInput
        placeholder="Descripción del evento"
        style={[styles.input, styles.descriptionInput]}
        multiline
      />

      <TouchableOpacity style={styles.optionRow} onPress={getUserLocation}>
        <Ionicons name="location-outline" size={20} color="#ff7f50" />
        <Text style={styles.optionText}>Agregar una ubicación</Text>
      </TouchableOpacity>

      {direccion && (
        <View style={styles.locationBox}>
          <Text>Dirección: {direccion}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.optionRow} onPress={toggleCalendar}>
        <Ionicons name="calendar-outline" size={20} color="#ff7f50" />
        <Text style={styles.optionText}>
          {selectedDate ? `Fecha seleccionada: ${selectedDate}` : 'Agregar una fecha'}
        </Text>
      </TouchableOpacity>

      <Modal visible={isCalendarVisible} animationType="slide" transparent={true} onRequestClose={toggleCalendar}>
        <View style={styles.modalBackground}>
          <View style={styles.calendarContainer}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={selectedDate ? { [selectedDate]: { selected: true, selectedColor: 'blue' } } : {}}
            />
            <TouchableOpacity onPress={toggleCalendar} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Button seleccionar la hora */}
      <TouchableOpacity style={styles.optionRow} onPress={() => setMostrarHora(true)}>
        <Ionicons name="time-outline" size={20} color="#ff7f50" />
        <Text style={styles.optionText}>
          {horaInicio ? `Hora: ${horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Agregar un horario'}
        </Text>
      </TouchableOpacity>

      {/* Selector de hora */}
      {mostrarHora && (
        <DateTimePicker
          value={horaInicio || new Date()}
          mode="time"
          display="default"
          onChange={onHoraChange}
        />
      )}

      <TouchableOpacity style={styles.publishButton}>
        <Text style={styles.publishText}>publicar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CrearForm;