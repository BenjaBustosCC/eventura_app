import React from 'react';
import { View, Text } from 'react-native';
import Button from '../../Components/Button';
import Header from '../../Components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import RegisterForm from './RegisterForm';
import styles from './styles';
import { useRegister } from '../../hooks/useRegister';

type RegisterScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleRegister,
  } = useRegister(navigation);

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