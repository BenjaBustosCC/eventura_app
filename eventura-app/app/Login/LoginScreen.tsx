// app/Login/LoginScreen.tsx
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import LoginForm from "./LoginForm";
import Button from "../../Components/Button";
import Header from "../../Components/Header";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types";
import styles from "./styles";
import { useLogin } from "../../hooks/useLogin";
import { authService } from "../../services/authService";

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "Login">;
  setIsAuthenticated: (value: boolean) => void; // Nuevo prop
};

export default function LoginScreen({
  navigation,
  setIsAuthenticated,
}: LoginScreenProps) {
  const { email, setEmail, password, setPassword, isLoading, handleLogin } =
    useLogin(); // Ahora no necesita navigation

  useEffect(() => {
    const handleUserData = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (!userData) {
          console.log("No hay datos de usuario disponibles.");
          return;
        }
        setIsAuthenticated(true); // Notifica a App.jsx
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    handleUserData();
  }, []);

  const onSubmit = async () => {
    const success = await handleLogin();
    if (success) {
      setIsAuthenticated(true); // Notifica a App.jsx
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>INICIO DE SESIÓN</Text>
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
        />
        <View
          style={{
            height: 220,
            alignItems: "center",
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Button onPress={onSubmit} title="Acceder" />
              <Button onPress={handleRegister} title="Registrarse" />
            </>
          )}
        </View>
      </View>
    </View>
  );
}
