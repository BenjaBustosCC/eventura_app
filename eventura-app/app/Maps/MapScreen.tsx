import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import MapForm from './MapForm';
import { useRoute } from '@react-navigation/native';


export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu Ubicación</Text>
      <MapForm />
    </View>
  );
}