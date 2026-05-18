import { Image, TextInput, View } from 'react-native';

import { ActionButton, Header } from '@/components';
import { styles } from './styles/HomeScreen';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.section}>
        <View style={styles.heroContainer}>
          <Image source={require('@/assets/images/hero.png')} style={styles.heroImage} resizeMode="cover" />

          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Pesquise pelo Título, Autor ou Categoria."
              style={styles.input}
              placeholderTextColor="#999"
            />

            <ActionButton title="Buscar" />
          </View>
        </View>
      </View>
    </View>
  );
}
