// ...otros imports
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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fetchTiposEvento, createEvento } from "../../services/eventService";
import { authService } from "../../services/authService";
import ButtonProps from "../../Components/Button";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddEventScreen({ onSuccess }: { onSuccess?: () => void }) {
  const insets = useSafeAreaInsets();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaTermino, setHoraTermino] = useState(new Date());
  const [tipoEventoId, setTipoEventoId] = useState("");
  const [tiposEvento, setTiposEvento] = useState<{ id: number | string; nombre: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoraInicio, setShowHoraInicio] = useState(false);
  const [showHoraTermino, setShowHoraTermino] = useState(false);
  const [sugerencias, setSugerencias] = useState<any[]>([]);

  const [latitud, setLatitud] = useState<number | null>(null);
  const [longitud, setLongitud] = useState<number | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (user && user.id) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    fetchTiposEvento()
      .then((data) => {
        setTiposEvento(data);
        setTipoEventoId(String(data[0]?.id || ""));
        setLoading(false);
      })
      .catch(() => {
        Alert.alert("Error", "No se pudieron cargar los tipos de evento");
        setLoading(false);
      });
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "No se encontró el usuario autenticado");
      return;
    }
    try {
      if (!lugar || latitud === null || longitud === null) {
        Alert.alert("Error", "Debes seleccionar un lugar válido");
        return;
      }

      const evento = {
        nombre_evento: nombre,
        descripcion_evento: descripcion,
        fecha_evento: fecha.toISOString().split("T")[0],
        hora_inicio_evento: horaInicio.toTimeString().slice(0, 5),
        hora_termino_evento: horaTermino.toTimeString().slice(0, 5),
        lugar_evento: lugar,
        id_usuario: userId,
        id_tipo_evento: tipoEventoId,
        latitud: latitud!,
        longitud: longitud!,
      };
      console.log("Evento a enviar:", evento);
      await createEvento(evento);
      Alert.alert("Éxito", "Evento creado correctamente");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error al crear evento:", error);
      Alert.alert("Error", `No se pudo crear el evento: ${error?.message || error}`);
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
      console.log("Coordenadas:", location.lat, location.lng);
    } else {
      Alert.alert("Error", "No se pudieron obtener las coordenadas del lugar");
    }
  };

  if (loading || !userId) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={{ paddingTop: insets.top, flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
          Crea un evento :3
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

        <View
          style={{
            height: 70,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonProps
            title="Crear Evento"
            onPress={handleSubmit}
            customStyle={styles.buttonPropsStyles}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
