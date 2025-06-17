import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fetchTiposEvento, updateEvento } from "../../services/eventService";
import ButtonProps from "../../Components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function EditEventScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const { evento } = route.params as any;

  const [nombre, setNombre] = useState(evento?.nombre_evento || evento?.nombre || evento?.titulo || "");
  const [descripcion, setDescripcion] = useState(evento?.descripcion_evento || evento?.descripcion || "");
  const [lugar, setLugar] = useState(evento?.lugar_evento || evento?.lugar || "");
  const [fecha, setFecha] = useState(evento?.fecha_evento ? new Date(evento.fecha_evento) : new Date());
  const [horaInicio, setHoraInicio] = useState(evento?.hora_inicio_evento ? new Date(`1970-01-01T${evento.hora_inicio_evento}:00`) : new Date());
  const [horaTermino, setHoraTermino] = useState(evento?.hora_termino_evento ? new Date(`1970-01-01T${evento.hora_termino_evento}:00`) : new Date());
  const [tipoEventoId, setTipoEventoId] = useState(evento?.id_tipo_evento ? String(evento.id_tipo_evento) : "");
  const [tiposEvento, setTiposEvento] = useState<{ id: number | string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoraInicio, setShowHoraInicio] = useState(false);
  const [showHoraTermino, setShowHoraTermino] = useState(false);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [latitud, setLatitud] = useState(evento?.latitud || null);
  const [longitud, setLongitud] = useState(evento?.longitud || null);

  // Imagen
  const [imagen, setImagen] = useState<string | null>(evento?.imagen || null);
  const [picking, setPicking] = useState(false);

  useEffect(() => {
    fetchTiposEvento()
      .then((data) => {
        setTiposEvento(data);
        if (!tipoEventoId && data[0]?.id) setTipoEventoId(String(data[0].id));
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Error", "No se pudieron cargar los tipos de evento");
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
  try {
    if (!lugar || latitud === null || longitud === null) {
      Alert.alert("Error", "Debes seleccionar un lugar válido");
      return;
    }

    if (!evento.id_usuario) {
  Alert.alert("Error", "El evento no tiene un usuario asignado.");
  return;
}

await updateEvento(evento.id_evento || evento.id, {
  nombre_evento: nombre,
  descripcion_evento: descripcion,
  fecha_evento: fecha.toISOString().split("T")[0],
  hora_inicio_evento: horaInicio.toTimeString().slice(0, 5),
  hora_termino_evento: horaTermino.toTimeString().slice(0, 5),
  lugar_evento: lugar,
  latitud: latitud!,
  longitud: longitud!,
  id_usuario: Number(evento.id_usuario), // asegúrate que no sea undefined/null
  id_tipo_evento: Number(tipoEventoId),
  imagen,
});
    Alert.alert("Éxito", "Evento actualizado correctamente");
    navigation.goBack();
  } catch (error: any) {
    console.log("Error al actualizar evento:", error);
    Alert.alert("Error", `No se pudo actualizar el evento: ${error?.message || error}`);
  }
};

  const buscarLugares = async (input: string) => {
    if (!input) return [];
    const apiKey = "AIzaSyD6w_NILALZTacu5qTPC2n0qUmI4isCUog";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&key=${apiKey}&language=es`
    );
    const json = await response.json();
    return json.predictions || [];
  };

  const obtenerCoordenadas = async (placeId: string) => {
    const apiKey = "AIzaSyD6w_NILALZTacu5qTPC2n0qUmI4isCUog";
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
    );
    const json = await response.json();

    const location = json.result?.geometry?.location;
    if (location) {
      setLatitud(location.lat);
      setLongitud(location.lng);
    } else {
      Alert.alert("Error", "No se pudieron obtener las coordenadas del lugar");
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
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}
      contentContainerStyle={[styles.container, { paddingBottom: 32 }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
        Editar evento
      </Text>

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
        placeholder="Buscar lugar del evento"
        value={lugar}
        onChangeText={async (text) => {
          setLugar(text);
          if (text.length > 2) {
            const resultados = await buscarLugares(text);
            setSugerencias(resultados);
          } else {
            setSugerencias([]);
          }
        }}
      />
      {sugerencias.length > 0 && (
        <View style={{ maxHeight: 150, marginBottom: 8 }}>
          {sugerencias.map((item) => (
            <TouchableOpacity
              key={item.place_id}
              onPress={() => {
                setLugar(item.description);
                setSugerencias([]);
                obtenerCoordenadas(item.place_id);
              }}
            >
              <Text style={{ paddingVertical: 8 }}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Fecha del Evento</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
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
      <TouchableOpacity onPress={() => setShowHoraInicio(true)} style={styles.input}>
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
      <TouchableOpacity onPress={() => setShowHoraTermino(true)} style={styles.input}>
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
      <View style={styles.picker}>
        {tiposEvento.map((tipo) => (
          <TouchableOpacity
            key={tipo.id}
            style={[
              styles.pickerItem,
              tipoEventoId === String(tipo.id) && styles.pickerItemSelected,
            ]}
            onPress={() => setTipoEventoId(String(tipo.id))}
          >
            <Text
              style={
                tipoEventoId === String(tipo.id)
                  ? styles.pickerTextSelected
                  : styles.pickerText
              }
            >
              {tipo.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Imagen */}
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

      <View
        style={{
          height: 70,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ButtonProps
          title="Guardar Cambios"
          onPress={handleSubmit}
          customStyle={styles.buttonPropsStyles}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  containerLoading: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    justifyContent: "center",
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
  picker: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  pickerItem: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff9800",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff7e6",
  },
  pickerItemSelected: {
    backgroundColor: "#ff9800",
  },
  pickerText: {
    color: "#ff9800",
  },
  pickerTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonPropsStyles: {
    width: 300,
    backgroundColor: "#191013",
    borderRadius: 30,
    paddingVertical: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
});