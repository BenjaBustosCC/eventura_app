import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./app/SplashScreen/SplashScreen";
import LoginScreen from "./app/Login/LoginScreen";
import HomeScreen from "./app/Home/HomeScreen";
import RegisterScreen from "./app/Register/RegisterScreen";
import BottomTabNavigator from "./Navigation/BottomTab";
import { authService } from "./services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DetalleEventoScreen from "./app/DetalleEvento/DetalleEventoScreen";
import EditEventScreen from "./app/EditEvent/EditEventScreen";
import ArtistRegisterScreen from "./app/Profile/ArtistRegisterScreen";




const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        //comentar y descomentar para dejar la sesion
       // await AsyncStorage.clear();

        const token = await authService.getToken();
        if (!token) {
          setLoading(false);
          return;
        }

        const user = await authService.getCurrentUser();
        const role = Number(user?.role ?? user?.id_rol);

        if (![1, 2, 3].includes(role)) {
          await authService.logout();
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUserRole(role);
      } catch (error) {
        console.error("Error restaurando sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
  <NavigationContainer>
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
          <Stack.Screen name="MainTabs">
            {(props) => (
              <BottomTabNavigator
                {...props}
                setIsAuthenticated={setIsAuthenticated}
                userRole={userRole}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="DetalleEventoScreen" component={DetalleEventoScreen} />
          <Stack.Screen name="EditEventScreen" component={EditEventScreen} /> 
          <Stack.Screen
  name="ArtistRegisterScreen"
  component={ArtistRegisterScreen}
  options={{ title: "Registro como Artista" }}
/>
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
