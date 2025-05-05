import React from 'react';
import { Button } from 'react-native';

export default function RegisterButton({ onPress }: { onPress: () => void }) {
  return <Button title="Registrarse" onPress={onPress} />;
}