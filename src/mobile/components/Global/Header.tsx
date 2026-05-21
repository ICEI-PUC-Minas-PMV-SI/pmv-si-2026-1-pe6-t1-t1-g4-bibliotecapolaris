import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { router } from 'expo-router';

import { ActionButton } from './ActionButton';

type UserType = 'guest' | 'user' | 'admin';

export function Header() {
  const isLoggedIn = false;
  const isAdmin = false;

  const showLeft = true;
  const showRight = !isLoggedIn;

  const label = !isLoggedIn ? 'Entrar' : isAdmin ? 'Painel' : 'Perfil';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.left}>
        {showLeft && (
          <ActionButton
            title="Sair"
            variant="outline"
            style={{ width: 88 }}
            onPress={() => {
              router.push('/admin');
            }}
          />
        )}
      </View>

      <View style={styles.center}>
        <Pressable onPress={() => router.replace('/')}>
          <Image source={require('@/assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        </Pressable>
      </View>

      <View style={styles.right}>
        {showRight && (
          <ActionButton
            title={label}
            variant="fill"
            style={{ width: 88 }}
            onPress={() => {
              router.push('/login');
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    height: 80,
    width: '100%',
    paddingHorizontal: 16,
  },

  logo: {
    width: 180,
    height: 80,
  },

  left: {
    flex: 1,
    alignItems: 'flex-start',
  },

  center: {
    position: 'absolute',

    left: 0,
    right: 0,
    alignItems: 'center',
  },

  right: {
    flex: 1,

    alignItems: 'flex-end',
  },
});
