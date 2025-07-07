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
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SearchBar from "../../Components/SearchBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ItineraryModal from "../ItineraryAssistant/ItineraryModal";

type Evento = {
  id_evento?: number | string;
  nombre?: string;
  titulo?: string;
  fecha?: string;
  descripcion?: string;
  imagen?: string;
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filteredEventos, setFilteredEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredEventos(eventos);
    } else {
      const lower = text.toLowerCase();
      setFilteredEventos(
        eventos.filter((ev) =>
          (ev.nombre || ev.titulo || "").toLowerCase().includes(lower)
        )
      );
    }
  };

  const handleBrujulaPress = () => {
    console.log("Brujula presionada");
    setIsModalVisible(true);
  };

  const handlePress = (evento: Evento) => {
    navigation.navigate("DetalleEventoScreen", { evento });
  };

  useFocusEffect(
  React.useCallback(() => {
    setLoading(true);
    fetchEventos()
      .then((data) => {
        // Filtra solo eventos con id_estado_evento === 2
        const aprobados = data.filter(
          (ev: any) => ev.id_estado === 2 || ev.id_estado_evento === 2
        );
        setEventos(aprobados);
        setFilteredEventos(aprobados); // Inicializa con los eventos aprobados
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
        <ActivityIndicator size="large" color="#650F0B" />
      </View>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <SearchBar onSearch={handleSearch} onBrujulaPress={handleBrujulaPress} />
      <View style={styles.container}>
        <FlatList
          data={filteredEventos}
          keyExtractor={(item) =>
            item.id_evento?.toString() || Math.random().toString()
          }
          renderItem={({ item }) => (
            <HomeCard
              nombre={item.nombre || item.titulo || "Evento sin nombre"}
              fecha={item.fecha || ""}
              imagen={item.imagen}
              onPress={() => handlePress(item)}
            />
          )}
          ListEmptyComponent={<Text>No hay eventos disponibles.</Text>}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {isModalVisible && (
        <ItineraryModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
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
