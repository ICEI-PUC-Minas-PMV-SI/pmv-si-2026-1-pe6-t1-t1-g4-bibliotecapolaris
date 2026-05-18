import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ActionButton } from './ActionButton';

export function Header() {
  return (
    <View style={styles.headerContainer}>
      <ActionButton title="Sair" variant="outline" onPress={() => router.push('/')} />

      <Pressable onPress={() => router.push('/')}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      </Pressable>

      <ActionButton title="Entrar" variant="fill" onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    zIndex: 50,

    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    width: '100%',
    paddingBottom: 40,
    paddingHorizontal: 32,
  },

  logo: {
    width: 320,
    height: 80,
  },
});
