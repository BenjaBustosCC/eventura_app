import React from 'react';
import { View, Text } from 'react-native';
import LoginForm from './LoginForm';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import styles from './styles';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const handleLogin = () => {
    // Aquí puedes agregar la lógica de inicio de sesión
    navigation.navigate('Home');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Text style={styles.title}>INICIO DE SESIÓN</Text>
        <LoginForm />
        <Button onPress={handleLogin} title='Acceder'/>
        <Button onPress={handleRegister} title='Registrarse' />
      </View>
    </View>
  );
}