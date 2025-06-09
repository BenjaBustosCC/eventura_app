import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import MapForm from './MapForm';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Ubicación</Text>
      <MapForm />
    </View>
  );
}