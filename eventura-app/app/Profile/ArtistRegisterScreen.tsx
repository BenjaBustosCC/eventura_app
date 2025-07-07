import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { artistService } from "../../services/artistService";
import { authService } from "../../services/authService";

export default function GestorRegisterScreen({ navigation }: any) {
  const [nombreGestor, setNombreGestor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Obtener el usuario autenticado
    authService.getCurrentUser().then(user => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      Alert.alert("Error", "No se pudo obtener el usuario autenticado.");
      return;
    }
    if (!nombreGestor || !descripcion) {
      Alert.alert("Campos requeridos", "Completa todos los campos obligatorios.");
      return;
    }
    try {
      await artistService.createSolicitud({
        usuario_id: userId,
        instagram_link: instagram,
        youtube_link: youtube,
        descripcion,
        id_estado: 1, // 1 = pendiente
      });
      Alert.alert("¡Solicitud enviada!", "Tu registro como gestor ha sido enviado.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Error", "No se pudo enviar la solicitud.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Fila con botón y título */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Registro como Gestor</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre de gestor"
        value={nombreGestor}
        onChangeText={setNombreGestor}
      />
      <TextInput
        style={styles.input}
        placeholder="Instagram (opcional)"
        value={instagram}
        onChangeText={setInstagram}
      />
      <TextInput
        style={styles.input}
        placeholder="YouTube (opcional)"
        value={youtube}
        onChangeText={setYoutube}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enviar solicitud</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
  flex: 1, 
  padding: 24, 
  paddingTop: 48, // <-- agrega este valor para bajar todo
  backgroundColor: "#fff" 
},
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#BB271A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    alignSelf: "flex-start",
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#BB271A" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#BB271A",
    padding: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});