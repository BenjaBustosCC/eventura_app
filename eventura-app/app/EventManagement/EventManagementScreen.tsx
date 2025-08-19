import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { fetchEventos, updateEstadoEvento } from "../../services/eventService";

interface Props {
  onSolicitudesChange?: (count: number) => void;
}

export default function EventManagementScreen({ onSolicitudesChange }: Props) {
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarEventos = () => {
    setLoading(true);
    fetchEventos()
      .then(data => {
        setEventos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  // Actualiza el contador de solicitudes cada vez que cambian los eventos
  useEffect(() => {
    if (onSolicitudesChange) {
      const count = eventos.filter(e => e.id_estado === 1 || e.id_estado == null).length;
      onSolicitudesChange(count);
    }
  }, [eventos, onSolicitudesChange]);

const handleChangeEstado = async (evento: any, nuevoEstado: number) => {
  try {
    await updateEstadoEvento(evento.id_evento ?? evento.id, nuevoEstado);
    Alert.alert("Éxito", `Evento ${nuevoEstado === 2 ? "aprobado" : "rechazado"}`);
    setEventos(prev =>
      prev.map(ev => {
        const evId = ev.id_evento ?? ev.id;
        const targetId = evento.id_evento ?? evento.id;
        return evId === targetId
          ? { ...ev, id_estado: nuevoEstado }
          : ev;
      })
    );
  } catch (error) {
    Alert.alert("Error", "No se pudo actualizar el estado del evento");
  }
};

// Agrupa los eventos por estado
const solicitudes = eventos.filter(e => e.id_estado === 1 || e.id_estado == null);
const aprobados = eventos.filter(e => e.id_estado === 2);
const rechazados = eventos.filter(e => e.id_estado === 3);
const finalizados = eventos.filter(e => e.id_estado === 4);

// Crea una lista combinada con secciones
const dataWithSections = [
  ...(solicitudes.length > 0 ? [{ section: "Solicitudes:" }, ...solicitudes] : []),
  ...(aprobados.length > 0 ? [{ section: "Eventos aprobados:" }, ...aprobados] : []),
  ...(rechazados.length > 0 ? [{ section: "Eventos rechazados:" }, ...rechazados] : []),
  ...(finalizados.length > 0 ? [{ section: "Eventos finalizados:" }, ...finalizados] : []),
];
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#BB271A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Eventos</Text>
      <FlatList
        data={dataWithSections}
        keyExtractor={(item, idx) =>
          item.section ? `section-${item.section}` : item.id?.toString() || item.id_evento?.toString() || idx.toString()
        }
        renderItem={({ item }) => {
          if (item.section) {
            // Renderiza el título de la sección
            return <Text style={styles.sectionTitle}>{item.section}</Text>;
          }
          // Determina el color de fondo según el estado
          let cardBg = "#FFF59D";
          if (item.id_estado === 1 || item.id_estado == null) cardBg = "#FFF59D"; // Amarillo
          else if (item.id_estado === 2) cardBg = "#A5D6A7"; // Verde
          else if (item.id_estado === 3) cardBg = "#EF9A9A"; // Rojo
          else if (item.id_estado === 4) cardBg = "#B0BEC5"; // Gris
          return (
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <Image
                source={{
                  uri: item.imagen
                    ? item.imagen.startsWith("data:image")
                      ? item.imagen
                      : `data:image/jpeg;base64,${item.imagen}`
                    : "https://via.placeholder.com/100x60/ff9800/ffffff?text=Evento"
                }}
                style={styles.imagen}
                resizeMode="cover"
              />
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.nombre || item.titulo}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
                {(item.id_estado === 1 || item.id_estado == null) && (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[styles.button, styles.aprobar]}
                      onPress={() => handleChangeEstado(item, 2)}
                    >
                      <Text style={styles.buttonText}>Aprobar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.rechazar]}
                      onPress={() => handleChangeEstado(item, 3)}
                    >
                      <Text style={styles.buttonText}>Rechazar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text>No hay eventos disponibles.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#BB271A", marginBottom: 16, textAlign: "center" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 12,
    padding: 10,
    elevation: 2,
  },
  imagen: { width: 100, height: 60, borderRadius: 6, marginRight: 12 },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: "bold", color: "#333" },
  descripcion: { fontSize: 14, color: "#666", marginTop: 4 },
  buttonRow: { flexDirection: "row", marginTop: 8 },
  button: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    marginHorizontal: 4,
    alignItems: "center",
  },
  aprobar: { backgroundColor: "#4CAF50" },
  rechazar: { backgroundColor: "#BB271A" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});