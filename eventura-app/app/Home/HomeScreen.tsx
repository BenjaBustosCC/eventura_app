import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { fetchEventos } from "../../services/eventService";
import HomeCard from "./HomeCard";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../../Components/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CompassBtn from "../../Components/CompassBtn";
import ItineraryModal from "../ItineraryAssistant/ItineraryModal";

type Evento = {
  id_evento?: number | string;
  nombre?: string;
  titulo?: string;
  fecha?: string;
  descripcion?: string;
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = (text: string) => {
    console.log("Texto de búsqueda:", text);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchEventos()
        .then((data) => {
          setEventos(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingRight: 70,
          paddingLeft: 10,
        }}
      >
        <SearchBar onSearch={handleSearch} />
        <CompassBtn onBrujulaPress={() => setModalVisible(true)} />
      </View>

      {/* Modal de ChatGPT */}
      <ItineraryModal visible={modalVisible} onClose={() => setModalVisible(false)} />


      <View style={styles.container}>
        <FlatList
          data={eventos}
          keyExtractor={(item) =>
            item.id_evento?.toString() || Math.random().toString()
          }
          renderItem={({ item }) => (
            <HomeCard
              nombre={item.nombre || item.titulo || "Evento sin nombre"}
              fecha={item.fecha || ""}
            />
          )}
          ListEmptyComponent={<Text>No hay eventos disponibles.</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    borderColor: "red",
    borderWidth: 1,
  },
  containerLoading: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
});
