import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ButtonProps from "../../Components/Button";
import { authService } from "../../services/authService";

export default function ProfileScreen({
  setIsAuthenticated,
}: {
  setIsAuthenticated?: (value: boolean) => void;
}) {
  const handleLogout = async () => {
    await authService.logout();
    if (typeof setIsAuthenticated === "function") {
      setIsAuthenticated(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla perfil</Text>
      <ButtonProps
        title="Cerrar sesión"
        onPress={handleLogout}
        customStyle={styles.button}
      />
    </View>
  );
}

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
});
