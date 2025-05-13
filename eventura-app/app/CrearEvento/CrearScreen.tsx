// CrearScreen.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from './styles';
import CrearForm from './CrearForm';
import { useEventContext } from '../context/EventContext';

const CrearScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { agregarEvento } = useEventContext();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Se requiere permiso para acceder a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePublicar = (titulo: string, descripcion: string, fecha: string) => {
    agregarEvento({ titulo, descripcion, fecha, imagen: selectedImage, id: 0 });
    navigation.goBack(); // volver a Home
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>Nuevo evento</Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        ) : (
          <Ionicons name="add" size={32} color="gray" />
        )}
      </TouchableOpacity>

      <CrearForm onPublicar={handlePublicar} />
    </ScrollView>
  );
};

export default CrearScreen;
