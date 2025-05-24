import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import EventCard from "./EventCard";
import { fetchEventosByUserId } from "../../services/eventService";
import { authService } from "../../services/authService";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Evento = {
  descripcion: string;
  id_evento?: number | string;
  nombre?: string;
  titulo?: string;
  nombre_evento?: string;
  descripcion_evento?: string;
  fecha?: string;
  imagen?: string;
};

export default function EventScreen() {
  const insets = useSafeAreaInsets();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      if (user && user.id) {
        fetchEventosByUserId(user.id)
          .then((data) => {
            setEventos(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: insets.top }}>
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>Tus eventos</Text>
        </View>
        <FlatList
          data={eventos}
          keyExtractor={(item) =>
            item.id_evento?.toString() || Math.random().toString()
          }
          renderItem={({ item }) => (
            <EventCard
              nombre={
                item.titulo ||
                item.nombre_evento ||
                item.nombre ||
                "Evento sin nombre"
              }
              fecha={item.fecha || ""}
              imagen={item.imagen}
              descripcion={item.descripcion || "Descripción no disponible"}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text>No tienes eventos.</Text>}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
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
    textAlign: "center",
  },
});
