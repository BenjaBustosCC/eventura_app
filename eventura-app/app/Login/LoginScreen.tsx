import React from 'react';
import { View } from 'react-native';
import LoginForm from './Components/LoginForm';
import LoginButton from './Components/LoginButton';
import RegisterButton from './Components/RegisterButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const handleLogin = () => {
    // Aquí puedes agregar la lógica de autenticación
    navigation.navigate('Home');
  };

  const handleRegister = () => {
    // Lógica de registro
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LoginForm />
      <LoginButton onPress={handleLogin} />
      <RegisterButton onPress={handleRegister} />
    </View>
  );
}