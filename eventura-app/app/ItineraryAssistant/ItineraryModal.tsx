import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import { generarItinerario } from "./ChatService";

type ItineraryModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ItineraryModal({ visible, onClose }: ItineraryModalProps) {
  const [userInput, setUserInput] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleClose = () => {
    setUserInput("");
    setRespuesta("");
    onClose();
  };

  const handleGenerar = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      const respuestaGenerada = await generarItinerario(userInput);
      setRespuesta(respuestaGenerada);
    } catch (error) {
      setRespuesta("Ocurrió un error generando el itinerario.");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Ruta turística 🧭</Text>

          <TextInput
            style={styles.input}
            placeholder="Quiero visitar..."
            value={userInput}
            onChangeText={setUserInput}
            multiline
          />

          <TouchableOpacity style={styles.button} onPress={handleGenerar}>
            <Text style={styles.buttonText}>Generar itinerario</Text>
          </TouchableOpacity>

          {loading && <ActivityIndicator size="small" color="#6200ee" style={{ marginTop: 10 }} />}

          <ScrollView style={styles.resultContainer}>
            <Text style={styles.resultText}>{respuesta}</Text>
          </ScrollView>

          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    maxHeight: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#BB271A",
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 16,
    maxHeight: 200,
  },
  resultText: {
    fontSize: 16,
    lineHeight: 24,
  },
  closeButton: {
    marginTop: 12,
    alignSelf: "flex-end",
  },
  closeText: {
    color: "#BB271A",
    fontWeight: "bold",
  },
});
