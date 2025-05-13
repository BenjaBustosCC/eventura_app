// app/Home/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import styles from './styles';
import EventoCard from './HomeForm';
import { useEventContext } from '../context/EventContext';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();
  const [showFilters, setShowFilters] = React.useState(false);
  const { eventos } = useEventContext();

  return (
    <SafeAreaView style={styles.wrapper} edges={['top', 'left', 'right']}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} style={styles.searchIcon} color="#b22222" />
        <TextInput placeholder="Buscar..." style={styles.searchInput} />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="options-outline" size={20} color="#b22222" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterDropdown}>
          <TouchableOpacity style={styles.filterOption}>
            <Text>Fecha</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption}>
            <Text>Ubicación</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterOption}>
            <Text>Categoría</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.container}>
          {eventos.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No hay eventos aún.
            </Text>
          ) : (
            eventos.map((evento) => (
              <EventoCard
                key={evento.id}
                titulo={evento.titulo}
                fecha={evento.fecha}
                imagen={evento.imagen ?? ''}
              />
            ))
          )}
        </ScrollView>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom || 10 }]}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={26} color="#b22222" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={26} color="#b22222" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Crear')}>
          <Ionicons name="heart-outline" size={26} color="#b22222" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person-outline" size={26} color="#b22222" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
