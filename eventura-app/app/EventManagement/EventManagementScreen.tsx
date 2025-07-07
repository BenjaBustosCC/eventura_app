import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EventManagementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Eventos</Text>
      {/* Aquí puedes agregar la lógica y UI para gestionar eventos */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#BB271A" },
});