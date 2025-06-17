import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { userService } from "../../services/userService";

// Define el tipo de usuario según tu backend
type User = {
  id: number;
  nombre_usuario: string;
  id_rol: number;
};

const ROLE_LABELS: Record<number, string> = {
  1: "Administrador",
  2: "Usuario",
  3: "Organizador",
};

export default function UserListScreen() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    userService.etAllUsers()
      .then((data: User[]) => setUsuarios(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleRoleChange = async (userId: number, newRole: number) => {
    try {
      await userService.updateUserRole(userId, newRole);
      Alert.alert("Rol actualizado", "El tipo de usuario ha sido cambiado.");
      fetchUsers(); // Refresca la lista
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el rol.");
    }
  };

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
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.name}>{item.nombre_usuario}</Text>
              <Text style={styles.label}>Tipo de usuario:</Text>
            </View>
            <Picker
              selectedValue={item.id_rol}
              style={styles.picker}
              onValueChange={(value) => handleRoleChange(item.id, value)}
            >
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <Picker.Item key={key} label={label} value={Number(key)} />
              ))}
            </Picker>
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24, color: "#BB271A" },
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
  picker: { width: 150, height: 40 },
});