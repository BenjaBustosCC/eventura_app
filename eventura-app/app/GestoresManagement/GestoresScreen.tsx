import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Linking, Alert } from "react-native";
import { artistService } from "../../services/artistService";

export default function GestoresScreen() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const data = await artistService.getAllSolicitudes();
        const pendientes = data.filter((s: any) => s.ID_ESTADO !== 2);
        setSolicitudes(pendientes);
      } catch {
        setSolicitudes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSolicitudes();
  }, []);

  const handleAprobar = async (solicitud: any) => {
    try {
      await artistService.updateEstadoSolicitud(solicitud.ID, 2); // 2 = aprobada
      await artistService.updateUserRole(solicitud.USUARIO_ID, 3); // 3 = gestor
      setSolicitudes((prev) => prev.filter((s) => s.ID !== solicitud.ID));
      Alert.alert("Solicitud aprobada", "El usuario ahora es gestor.");
    } catch (e) {
      Alert.alert("Error", "No se pudo aprobar la solicitud.");
    }
  };

  const handleRechazar = async (solicitud: any) => {
    try {
      await artistService.updateEstadoSolicitud(solicitud.ID, 3); // 3 = rechazada
      setSolicitudes((prev) => prev.filter((s) => s.ID !== solicitud.ID));
      Alert.alert("Solicitud rechazada", "La solicitud ha sido rechazada.");
    } catch (e) {
      Alert.alert("Error", "No se pudo rechazar la solicitud.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#BB271A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Solicitudes de Gestor</Text>
      {solicitudes.length === 0 ? (
        <Text style={styles.subtitle}>No hay solicitudes pendientes.</Text>
      ) : (
        <FlatList
          data={solicitudes}
          keyExtractor={(item, idx) => item.ID?.toString() ?? idx.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nombre}>
                {item.NOMBRE_USUARIO
                  ? `👤 ${item.NOMBRE_USUARIO}`
                  : `Usuario ID: ${item.USUARIO_ID}`}
              </Text>
              <Text style={styles.label}>Instagram:</Text>
              {item.INSTAGRAM_LINK && item.INSTAGRAM_LINK.trim() ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.INSTAGRAM_LINK)}>
                  <Text style={styles.link} numberOfLines={1}>
                    {item.INSTAGRAM_LINK}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noInfo}>No especificado</Text>
              )}
              <Text style={styles.label}>YouTube:</Text>
              {item.YOUTUBE_LINK && item.YOUTUBE_LINK.trim() ? (
                <TouchableOpacity onPress={() => Linking.openURL(item.YOUTUBE_LINK)}>
                  <Text style={styles.link} numberOfLines={1}>
                    {item.YOUTUBE_LINK}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noInfo}>No especificado</Text>
              )}
              <Text style={styles.label}>Descripción:</Text>
              <Text style={styles.descripcion}>
                {item.DESCRIPCION && item.DESCRIPCION.trim() ? item.DESCRIPCION : "No especificado"}
              </Text>
              <Text style={styles.estado}>
                Estado: {item.NOMBRE_ESTADO || item.ID_ESTADO}
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
                  onPress={() => handleAprobar(item)}
                >
                  <Text style={styles.actionButtonText}>Aprobar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#BB271A" }]}
                  onPress={() => handleRechazar(item)}
                >
                  <Text style={styles.actionButtonText}>Rechazar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#BB271A",
    marginBottom: 12,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    paddingHorizontal: 24,
    marginTop: 24,
  },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  nombre: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  estado: { marginTop: 8, color: "#888" },
  link: {
    color: "#1B95E0",
    textDecorationLine: "underline",
    marginBottom: 4,
    fontSize: 14,
  },
  label: {
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 2,
    color: "#BB271A",
  },
  noInfo: {
    color: "#888",
    marginBottom: 4,
  },
  descripcion: {
    marginBottom: 8,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});