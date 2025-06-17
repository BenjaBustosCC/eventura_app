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


const Stack = createStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = await authService.getToken();
      if (token) {
        setIsAuthenticated(true);
        const user = await authService.getCurrentUser();
        setUserRole(user?.role ?? user?.id_rol ?? null);
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  if (loading) {
    return <SplashScreen />; // O un ActivityIndicator
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
          <Stack.Screen name="MainTabs">
            {(props) => (
              <BottomTabNavigator
                {...props}
                setIsAuthenticated={setIsAuthenticated}
                userRole={userRole}
              />
            )}
          </Stack.Screen>
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