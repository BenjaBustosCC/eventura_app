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
import {
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function AddEventScreen({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const insets = useSafeAreaInsets();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [lugar, setLugar] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaTermino, setHoraTermino] = useState(new Date());
  const [tipoEventoId, setTipoEventoId] = useState("");
  const [tiposEvento, setTiposEvento] = useState<
    { id: number | string; nombre: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showHoraInicio, setShowHoraInicio] = useState(false);
  const [showHoraTermino, setShowHoraTermino] = useState(false);

  // Obtener usuario autenticado
  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (user && user.id) setUserId(user.id);
    });
  }, []);

  // Obtener tipos de evento
  useEffect(() => {
    fetchTiposEvento()
      .then((data) => {
        setTiposEvento(data);
        setTipoEventoId(data[0]?.id || "");
        setLoading(false);
      })
      .catch((error) => {
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
      const evento = {
        nombre_evento: nombre,
        descripcion_evento: descripcion,
        fecha_evento: fecha.toISOString().split("T")[0],
        hora_inicio_evento: horaInicio.toTimeString().slice(0, 5),
        hora_termino_evento: horaTermino.toTimeString().slice(0, 5),
        lugar_evento: lugar,
        id_usuario: userId,
        id_tipo_evento: tipoEventoId,
      };
      console.log("Evento a enviar:", evento);
      await createEvento(evento);
      Alert.alert("Éxito", "Evento creado correctamente");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error al crear evento:", error);
      Alert.alert(
        "Error",
        `No se pudo crear el evento: ${error?.message || error}`
      );
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
        <View style={styles.picker}>
          {tiposEvento.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              style={[
                styles.pickerItem,
                tipoEventoId === tipo.id && styles.pickerItemSelected,
              ]}
              onPress={() => setTipoEventoId(String(tipo.id))}
            >
              <Text
                style={
                  tipoEventoId === tipo.id
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
          style={{ height: 70, alignItems: "center", justifyContent: "center" }}
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
