import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import LoginForm from './LoginForm';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import styles from './styles';
import { useLogin } from '../../hooks/useLogin';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    handleRegister
  } = useLogin({ navigation });

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
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button onPress={handleLogin} title='Acceder'/>
            <Button onPress={handleRegister} title='Registrarse' />
          </>
        )}
      </View>
    </View>
  );
}