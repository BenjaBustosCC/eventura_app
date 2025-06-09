import 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./app/SplashScreen/SplashScreen";
import LoginScreen from "./app/Login/LoginScreen";
import RegisterScreen from "./app/Register/RegisterScreen";
import EditScreen from "./app/EditEventos/EditScreen";
import BottomTabNavigator from "./Navigation/BottomTab";
import EditEventScreen from "./app/EditEvent/EditEventScreen"; // <-- Usa el wrapper, no el form
import DetalleEventoScreen from './app/DetalleEvento/DetalleEventoScreen';


const Stack = createStackNavigator<RootStackParamList>(); // <-- Aplica el tipo al stack

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SplashScreen />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Pantallas principales (con tabs) + EditEventScreen
          <>
            <Stack.Screen name="HomeTabs" component={BottomTabNavigator} />
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