import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import LoginForm from './LoginForm';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import styles from './styles';
import { authService } from '../../services/authServices';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await authService.login(email, password);

      if (data.token) {
        // Aquí puedes guardar el token en AsyncStorage si lo necesitas
        // await AsyncStorage.setItem('userToken', data.token);
        
        // Navegar a Home
        navigation.navigate('Home');
      }
    } catch (error: any) {
      console.error('Error detallado:', error);
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>INICIO DE SESIÓN</Text>
        <LoginForm 
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
        />
        <Button onPress={handleLogin} title='Acceder'/>
        <Button onPress={handleRegister} title='Registrarse' />
      </View>
    </View>
  );
}