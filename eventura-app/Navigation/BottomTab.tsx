import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import HomeScreen from "../app/Home/HomeScreen";
import EventScreen from "../app/Eventos/EventScreen";
import MapaScreen from "../app/Maps/MapScreen";
import ProfileScreen from "../app/Profile/ProfileScreen";
import AddScreen from "../app/AddEvent/AddEventScreen";
import UserManagement from "../app/UserManagement/UserManagementScreen";
import EventManagementScreen from "../app/EventManagement/EventManagementScreen";
import { fetchEventos } from "../services/eventService";
import GestoresScreen from "../app/GestoresManagement/GestoresScreen"; // Asegúrate de tener este import
import ItineraryHistoryScreen from "../app/Itinerarios/ItinerarioScreen";



const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({
  setIsAuthenticated,
  userRole,
}: {
  setIsAuthenticated: (value: boolean) => void;
  userRole: number | null;
}) {
  const [solicitudesCount, setSolicitudesCount] = useState<number>(0);

  // Actualiza el contador cada vez que el tab recibe foco
  useFocusEffect(
    React.useCallback(() => {
      if (userRole === 1) {
        fetchEventos().then(eventos => {
          const count = eventos.filter(
            (e: any) => e.id_estado === 1 || e.id_estado == null
          ).length;
          setSolicitudesCount(count);
        });
      }
    }, [userRole])
  );

  if (userRole === null || userRole === undefined) {
    return null; // O un spinner de carga
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"];
          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          else if (route.name === "Eventos") iconName = focused ? "calendar" : "calendar-outline";
          else if (route.name === "Añadir") iconName = focused ? "add-circle" : "add-circle-outline";
          else if (route.name === "Mapa") iconName = focused ? "map" : "map-outline";
          else if (route.name === "Perfil") iconName = focused ? "person" : "person-outline";
          else if (route.name === "Gestión de Usuarios") iconName = focused ? "settings" : "settings-outline";
          else if (route.name === "Gestión de Eventos") iconName = focused ? "albums" : "albums-outline";
          else if (route.name === "Mis Itinerarios") iconName = focused ? "compass" : "compass-outline";
          else iconName = "ellipse";
          return <Ionicons name={iconName} size={24} color={"#BB271A"} />;
        },
        tabBarActiveTintColor: "#BB271A",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {/* Rol 2: Home, Mapa, Perfil */}
      {userRole === 2 && (
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Mapa" options={{ headerShown: false }} >
            {(props) => (
              <MapaScreen {...props}/>
            )}
          </Tab.Screen>
          <Tab.Screen name="Mis Itinerarios" component={ItineraryHistoryScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Perfil" options={{ headerShown: false }}>
            {(props) => (
              <ProfileScreen {...props} setIsAuthenticated={setIsAuthenticated} />
            )}
          </Tab.Screen>
        </>
      )}
      {/* Rol 3: Eventos, Añadir, Perfil */}
      {userRole === 3 && (
        <>
          <Tab.Screen name="Eventos" component={EventScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Añadir" component={AddScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Perfil" options={{ headerShown: false }}>
            {(props) => (
              <ProfileScreen {...props} setIsAuthenticated={setIsAuthenticated} />
            )}
          </Tab.Screen>
        </>
      )}
      {/* Rol 1: Gestión de Usuarios, Gestión de Eventos (con badge), Perfil */}
      {userRole === 1 && (
  <>
    
    <Tab.Screen name="Gestión de Usuarios" component={UserManagement} options={{ headerShown: false }} />
    <Tab.Screen
      name="Gestores"
      component={GestoresScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Gestión de Eventos"
      options={{
        headerShown: false,
        tabBarBadge: solicitudesCount > 0 ? solicitudesCount : undefined,
      }}
    >
      {(props) => (
        <EventManagementScreen
          {...props}
          onSolicitudesChange={setSolicitudesCount}
        />
      )}
    </Tab.Screen>
    <Tab.Screen name="Perfil" options={{ headerShown: false }}>
      {(props) => (
        <ProfileScreen {...props} setIsAuthenticated={setIsAuthenticated} />
      )}
    </Tab.Screen>
  </>
)}
    </Tab.Navigator>
  );
}