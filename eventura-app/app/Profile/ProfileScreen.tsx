import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import styles from './styles';
import ProfileForm from './ProfileForm';

const ProfileScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [image, setImage] = useState('https://tuimagenpordefecto.png');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Solo renderizamos ProfileForm, que ya incluye la imagen y el nombre */}
        <ProfileForm navigation={navigation} image={image} setImage={setImage} />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 10 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={26} color="#b22222"/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={26} color="#b22222"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Crear')}>
          <Ionicons name="heart-outline" size={26} color="#b22222"/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={26} color="#b22222"/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;