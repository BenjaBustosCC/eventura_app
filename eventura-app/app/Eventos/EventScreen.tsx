import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import EventCard from "./EventCard";
import { fetchEventosByUserId, deleteEvento } from "../../services/eventService";
import { authService } from "../../services/authService";
import styles from './styles';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

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

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function EventScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEventos = async () => {
    setLoading(true);
    const user = await authService.getCurrentUser();
    if (user && user.id) {
      try {
        const data = await fetchEventosByUserId(user.id);
        setEventos(data);
      } catch (error) {
        console.error("Error cargando eventos:", error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEventos();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "¿Eliminar evento?",
      "Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEvento(id);
              setEventos((prev) => prev.filter((e) => e.id_evento?.toString() !== id));
            } catch (error) {
              console.error("Error al eliminar:", error);
              Alert.alert("Error", "No se pudo eliminar el evento.");
            }
          },
        },
      ]
    );
  };

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
              id={item.id_evento?.toString() || ""}
              nombre={
                item.titulo ||
                item.nombre_evento ||
                item.nombre ||
                "Evento sin nombre"
              }
              fecha={item.fecha || ""}
              imagen={item.imagen}
              descripcion={item.descripcion || "Descripción no disponible"}
              onDelete={() => handleDelete(item.id_evento?.toString() || "")}
              onPress={() =>
                navigation.navigate("EditarEvento", {
                  id: item.id_evento?.toString() || "",
                })
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text>No tienes eventos.</Text>}
        />
      </SafeAreaView>
    </View>
  );
}