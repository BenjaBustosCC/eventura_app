import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  title: string;
  customStyle?: object;
};

export default function Button({ onPress, title, customStyle }: ButtonProps) {
  return (
    <Pressable onPress={onPress} style={customStyle || styles.button}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#191013',
    borderRadius: 30,
    paddingVertical: 12,
    width: 200,
    height: 50, 
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
