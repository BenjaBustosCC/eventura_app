// Navigation/AppNavigator.jsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTab';
import LoginScreen from '../app/Login/LoginScreen'; // Ejemplo de pantalla sin tabs
import DetalleEventoScreen from '../app/DetalleEvento/DetalleEventoScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="DetalleEventoScreen" component={DetalleEventoScreen} />
    </Stack.Navigator>
  );
}