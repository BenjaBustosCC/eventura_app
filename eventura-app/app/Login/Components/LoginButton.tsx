import React from 'react';
import { Button } from 'react-native';

export default function LoginButton({ onPress }: { onPress: () => void }) {
  return <Button title="Iniciar sesión" onPress={onPress} />;
}