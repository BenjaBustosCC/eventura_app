import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import styles from './styles';

const ProfileForm = ({ navigation, image, setImage }: any) => {
  const sections = [
    { title: 'Configuración', items: ['Administración de la cuenta', 'Notificaciones', 'Privacidad y datos'] },
    { title: 'Iniciar sesión', items: ['Seguridad', 'Cerrar sesión'] },
    { title: 'Soporte', items: ['Centro de asistencia', 'Condiciones de servicio', 'Política de privacidad', 'Información'] },
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitas permitir el acceso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      {/* Sección de avatar e ícono para cambiar la imagen */}
      <TouchableOpacity style={styles.profileSection} onPress={pickImage}>
        <Image source={{ uri: image }} style={styles.avatar} />
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Ionicons name="camera-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.name}>Nombre</Text>
      </TouchableOpacity>

      {sections.map((section, index) => (
        <View key={index}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.itemRow}>
              <Text style={styles.itemText}>{item}</Text>
              <Ionicons name="chevron-forward" size={18} color="gray" />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default ProfileForm;