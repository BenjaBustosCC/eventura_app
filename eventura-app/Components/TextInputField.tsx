import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

export default function TextInputField(props: TextInputProps) {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#888"
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#191013',
    paddingVertical: 8,
    paddingHorizontal: 4,
    fontSize: 16,
    marginVertical: 12,
    color: '#191013',
    backgroundColor: 'transparent',
  },
});