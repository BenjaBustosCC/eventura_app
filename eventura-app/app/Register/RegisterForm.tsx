import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextInputField from '../../Components/TextInputField';

type Props = {
  username: string;
  setUsername: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
};

export default function RegisterForm({
  username, setUsername,
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInputField
        placeholder="Nombre usuario"
        value={username}
        onChangeText={setUsername}
      />
      <TextInputField
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInputField
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInputField
        placeholder="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '70%',
    padding: 16,
  },
});