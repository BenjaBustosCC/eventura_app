import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import ButtonProps from "../../Components/Button";
import { authService } from "../../services/authService";
import { MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen({
  setIsAuthenticated,
}: {
  setIsAuthenticated?: (value: boolean) => void;
}) {
  const [userData, setUserData] = useState<{
    email: string;
    name: string;
  }>({ name: "Nombre de usuario", email: "Email" });
  const handleLogout = async () => {
    await authService.logout();
    if (typeof setIsAuthenticated === "function") {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const handleUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        console.log("🚀 ~ handleUserData ~ userData:", userData);
        if (!userData) {
          console.log("No hay datos de usuario disponibles.");
          return;
        }
        setUserData({
          name: userData.name || "Nombre de usuario",
          email: userData.email || "Email",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    handleUserData();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../../assets/kumito.jpg")}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.nombre}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
        <View style={styles.header}>
          <View style={styles.separator} />

          {/* Opciones de menú */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Configuración</Text>
            <MenuItem label="Administración de la cuenta" />
            <MenuItem label="Regístrate como artista" />
            <MenuItem label="Privacidad y datos" />
            <MenuItem label="Seguridad" />
            <MenuItem label="Cerrar sesión" handlePress={handleLogout} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soporte</Text>
            <MenuItem label="Centro de asistencia" />
            <MenuItem label="Condiciones de servicio" />
            <MenuItem label="Política de privacidad" />
            <MenuItem label="Información" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const MenuItem = ({
  label,
  handlePress,
}: {
  label: string;
  handlePress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={handlePress}
    disabled={!handlePress}
  >
    <Text style={styles.menuText}>{label}</Text>
    <MaterialIcons name="chevron-right" size={24} color="#ff9800" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  button: {
    width: 300,
    backgroundColor: "#191013",
    borderRadius: 30,
    paddingVertical: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  header: {
    alignItems: "flex-start",
    width: "100%",
    paddingVertical: 24,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    position: "relative",
    width: 100,
    height: 100,
    marginBottom: 8,
    marginTop: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#ff9800",
    borderRadius: 12,
    padding: 4,
  },
  nombre: {
    fontSize: 18,
    fontWeight: "600",
  },
  email: {
    fontSize: 18,
    fontWeight: "600",
  },
  separator: {
    height: 4,
    backgroundColor: "#ff9800",
    opacity: 0.2,
    marginHorizontal: 20,
    borderRadius: 4,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#444",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    width: "100%",
  },
  menuText: {
    color: "#333",
    fontSize: 16,
  },
});
