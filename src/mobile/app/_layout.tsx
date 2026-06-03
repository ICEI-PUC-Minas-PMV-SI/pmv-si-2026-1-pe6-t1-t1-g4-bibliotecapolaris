import React from 'react';

import { Colors } from '@/constants/Theme';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter-VariableFont_opsz,wght.ttf'),
    CrimsonPro: require('../assets/fonts/CrimsonPro-VariableFont_wght.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      />

      <StatusBar style="light" backgroundColor={Colors.background} />
    </AuthProvider>
  );
}
