import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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
        {/*PARA QUE LAS NAVEGACIONES (TABS Y STACK) FUNCIONEN JUNTAS HAY QUE QUITAR EL COMPONENTE
        Y USAR LOS PROPS (VER TAB.MAPA-TAB.PERFIL, ETC) PARA QUE SE COMBINEN
        Y EL STACK PUEDA SER USADO EN LOS TABS--CREO-- PERO ASI ME HA FUNCIONADO*/}
          <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Mapa" options={{ headerShown: false }} >
            {(props) => (
              <MapaScreen {...props}/>
            )}
          </Tab.Screen>
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