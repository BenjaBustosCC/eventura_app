import React, { useState, useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { itineraryService } from "../../services/itineraryService";
import { authService } from "../../services/authService";
import { useFocusEffect } from "@react-navigation/native";

export default function ItineraryHistoryScreen() {
  const [itinerarios, setItinerarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchItinerarios = async () => {
        setLoading(true);
        try {
          const user = await authService.getCurrentUser();
          if (user && user.id) {
            const data = await itineraryService.getItinerariosByUsuario(user.id);
            if (isActive) setItinerarios(data);
          } else {
            if (isActive) setItinerarios([]);
          }
        } catch (e) {
          if (isActive) setItinerarios([]);
        } finally {
          if (isActive) setLoading(false);
        }
      };
      fetchItinerarios();
      return () => {
        isActive = false;
      };
    }, [])
  );

  if (loading) return <ActivityIndicator size="large" color="#BB271A" />;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 12 }}>Mis Itinerarios</Text>
      <FlatList
        data={itinerarios}
        keyExtractor={item =>
          item.ID_ITINERARIO?.toString() ||
          item.id_itinerario?.toString() ||
          Math.random().toString()
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16, backgroundColor: "#fff7e6", borderRadius: 8, padding: 12 }}>
            <Text style={{ fontWeight: "bold" }}>
              {item.CIUDAD || item.ciudad} - {item.FECHA || item.fecha}
            </Text>
            <Text style={{ marginTop: 8 }}>{item.CONTENIDO || item.contenido}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No tienes itinerarios guardados.</Text>}
      />
    </View>
  );
}