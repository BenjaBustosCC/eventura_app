import React from 'react';
import { View, StyleSheet } from 'react-native';
import TextInputField from '../../Components/TextInputField';

type LoginFormProps = {
  email: string;
  password: string;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
};

export default function LoginForm({ 
  email, 
  password, 
  onEmailChange, 
  onPasswordChange 
}: LoginFormProps) {
  return (
    <View style={styles.container}>
      <TextInputField
        placeholder="Correo electrónico"
        value={email}
        onChangeText={onEmailChange}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInputField
        placeholder="Contraseña"
        value={password}
        onChangeText={onPasswordChange}
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