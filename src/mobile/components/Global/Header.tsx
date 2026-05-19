import React from 'react';

import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ActionButton } from './ActionButton';

export function Header() {
  return (
    <View style={styles.headerContainer}>
      <ActionButton title="Sair" variant="outline" style={{ flex: 2 }} onPress={() => router.push('/')} />

      <Pressable onPress={() => router.push('/')}>
        <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      </Pressable>

      <ActionButton title="Perfil" variant="fill" style={{ flex: 2 }} onPress={() => router.push('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',
    paddingHorizontal: 16,
  },

  logo: {
    width: 180,
    height: 80,
  },
});
