import React, { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';
import Input from '../../Components/TextInputField';
import styles from './styles';

interface LoginFormProps {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword
}) => {
  return (
    <View style={styles.form}>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>
  );
};

export default LoginForm;