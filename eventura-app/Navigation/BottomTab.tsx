import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View } from "react-native";

import HomeScreen from "../app/Home/HomeScreen";
import EventScreen from "../app/Eventos/EventScreen";
import MapaScreen from "../app/Maps/MapScreen";
import ProfileScreen from "../app/Profile/ProfileScreen";
import AddScreen from "../app/AddEvent/AddEventScreen";
import UserManagement from "../app/UserManagement/UserManagementScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator({
  setIsAuthenticated,
  userRole,
}: {
  setIsAuthenticated: (value: boolean) => void;
  userRole: number | null;
}) {
  // Mostrar loader mientras no se define el rol
  if (userRole === null || userRole === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#BB271A" />
      </View>
    );
  }

  return (
    <Tab.Navigator>
      {/* Rol 2: Home, Mapa, Perfil */}
      {userRole === 2 && (
        <>
          <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Mapa" component={MapaScreen} options={{ headerShown: false }} />
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

      {/* Rol 1: Solo Gestión de Usuarios */}
      {userRole === 1 && (
        <>
          <Tab.Screen name="Gestión de Usuarios" component={UserManagement} options={{ headerShown: false }} />
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