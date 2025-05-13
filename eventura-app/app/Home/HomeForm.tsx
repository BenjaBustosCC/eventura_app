import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import styles from './styles';

type EventoCardProps = {
  titulo: string;
  fecha: string;
  imagen: string;
};

const EventoCard = ({ titulo, fecha, imagen }: EventoCardProps) => (
  <View style={styles.card}>
    <Image style={styles.image} source={{ uri: imagen }} resizeMode="contain"/>
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{titulo}</Text>
      <Text style={styles.cardDate}>{fecha}</Text>
    </View>
  </View>
);

export default EventoCard;