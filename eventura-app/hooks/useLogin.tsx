// hooks/useLogin.tsx
import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/authService';

export const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return false; // Indica fallo
    }

    try {
      setIsLoading(true);
      await authService.login({ email, password });
      return true; // Indica éxito
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
  };
};