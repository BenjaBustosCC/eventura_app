import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../app/Home/HomeScreen";
import EventScreen from "../app/Eventos/EventScreen";
import MapaScreen from "../app/Maps/MapScreen";
import ProfileScreen from "../app/Profile/ProfileScreen";
import AddScreen from "../app/AddEvent/AddEventScreen";
import UserManagement from "../app/UserManagement/UserManagementScreen"; // Asegúrate de tener este archivo

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (value: boolean) => void;
}) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"];
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Eventos") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Añadir") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Mapa") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Perfil") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Gestión de Usuarios") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "ellipse"; // fallback icon
          }
          // Puedes personalizar el color/tamaño aquí si quieres resaltar el botón de añadir
          return <Ionicons name={iconName} size={24} color={"#BB271A"} />;
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Eventos" component={EventScreen} />
      <Tab.Screen name="Añadir" component={AddScreen} />
      <Tab.Screen name="Mapa" component={MapaScreen} />
      <Tab.Screen name="Perfil">
        {(props) => (
          <ProfileScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Gestión de Usuarios" component={UserManagement} />
    </Tab.Navigator>
  );
}
