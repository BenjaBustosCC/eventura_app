import 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./app/SplashScreen/SplashScreen";
import LoginScreen from "./app/Login/LoginScreen";
import RegisterScreen from "./app/Register/RegisterScreen";
import EditScreen from "./app/EditEventos/EditScreen";
import BottomTabNavigator from "./Navigation/BottomTab";
import EditEventScreen from "./app/EditEvent/EditEventScreen";
import DetalleEventoScreen from './app/DetalleEvento/DetalleEventoScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Redirección automática según el rol después de login
  useEffect(() => {
    if (isAuthenticated && userRole) {
      if (userRole === 3) {
        navigationRef.navigate('HomeTabs', { screen: 'Eventos' });
      } else if (userRole === 2) {
        navigationRef.navigate('HomeTabs', { screen: 'Home' });
      } else if (userRole === 1) {
        navigationRef.navigate('HomeTabs', { screen: 'Gestión de Usuarios' });
      }
    }
  }, [isAuthenticated, userRole]);

  if (isLoading) {
    return (
      <SplashScreen />
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                  setUserRole={setUserRole}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="HomeTabs"
              options={{ headerShown: false }}
            >
              {(props) => (
                <BottomTabNavigator
                  {...props}
                  setIsAuthenticated={setIsAuthenticated}
                  userRole={userRole}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="EditEventScreen" component={EditEventScreen} />
            <Stack.Screen name="DetalleEventoScreen" component={DetalleEventoScreen} />
          </>
        )}
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});