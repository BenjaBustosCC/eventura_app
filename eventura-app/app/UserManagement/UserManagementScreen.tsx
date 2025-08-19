import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity, // <-- Agrega esto
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { userService, User } from "../../services/userService";

const ROLE_LABELS: Record<number, string> = {
  1: "Administrador",
  2: "Usuario",
  3: "Organizador",
};

export default function UserListScreen() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(() => {
  setLoading(true);
  userService
    .getAllUsers()
    .then((data) => {
      const filtrados = data.filter((u) => u.id != null);
      // Ordena por id_rol ascendente
      filtrados.sort((a, b) => (a.id_rol ?? 99) - (b.id_rol ?? 99));
      setUsuarios(filtrados);
    })
    .catch(() => {
      Alert.alert("Error", "No se pudieron cargar los usuarios.");
    })
    .finally(() => setLoading(false));
}, []);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = useCallback(async (userId: number, newRole: number) => {
    try {
      await userService.updateUserRole(userId, newRole);
      Alert.alert("Rol actualizado", "El tipo de usuario ha sido cambiado.");
      fetchUsers();
    } catch {
      Alert.alert("Error", "No se pudo actualizar el rol.");
    }
  }, [fetchUsers]);

  // Nuevo: Eliminar usuario
  const handleDeleteUser = useCallback((userId: number) => {
    Alert.alert(
      "Eliminar usuario",
      "¿Estás seguro de que deseas eliminar este usuario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await userService.deleteUser(userId);
              Alert.alert("Usuario eliminado", "La cuenta ha sido eliminada.");
              fetchUsers();
            } catch {
              Alert.alert("Error", "No se pudo eliminar el usuario.");
            }
          },
        },
      ]
    );
  }, [fetchUsers]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#BB271A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usuarios Registrados</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item, index) =>
          item.id != null ? item.id.toString() : `user-${index}`
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.nombre_usuario}</Text>
              <Text style={styles.label}>Tipo de usuario:</Text>
            </View>
            <View>
              <Picker
                selectedValue={item.id_rol ?? 0}
                style={styles.picker}
                onValueChange={(value) => {
                  if (value !== 0) handleRoleChange(item.id, value);
                }}
              >
                <Picker.Item label="Seleccione rol..." value={0} />
                {Object.entries(ROLE_LABELS).map(([key, label]) => (
                  <Picker.Item key={key} label={label} value={Number(key)} />
                ))}
              </Picker>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteUser(item.id)}
              >
                <Text style={styles.deleteButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No hay usuarios registrados.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#BB271A",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  name: { fontSize: 16, color: "#333", fontWeight: "bold" },
  label: { fontSize: 14, color: "#888", marginTop: 4 },
  picker: {
    width: 160,
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  deleteButton: {
    marginTop: 8,
    backgroundColor: "#BB271A",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});