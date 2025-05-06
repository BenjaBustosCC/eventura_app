import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import RegisterForm from './RegisterForm';
import styles from './styles';
import { userService } from '../../services/userServices'; // Ajusta la ruta si es necesario

type RegisterScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    try {
      await userService.registerUser({ name: username, email, password });
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar');
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>REGISTRO</Text>
        <RegisterForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
        <Button onPress={handleRegister} title='Registrarse'/>
      </View>
    </View>
  );
}