import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

import { useAlertModal } from '@/hooks/useAlertModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/styles/LoginScreen';
import { AlertModal } from '@/components/Global/AlertModal';
import { router } from 'expo-router';
import { Header } from '@/components/Global/Header';

export default function SignScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showError, modal, close } = useAlertModal();

  function goToLogin() {
    router.replace('/login');
  }

  async function handleSign() {
    try {
      setIsLoading(true);

      if (!name || !email || !password) {
        throw new Error('Preencha todos os campos');
      }

      console.log('sign...');
    } catch (err: any) {
      showError('Erro', err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.formContainer}>
        <Text style={styles.title}>REGISTRAR </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="John Doe"
          placeholderTextColor="#999"
          style={styles.input}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="JohnDoe@unipolaris.com"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          onPress={handleSign}
          disabled={isLoading}
          style={[styles.button, isLoading && { opacity: 0.6 }]}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Entrando... ' : 'Entrar '}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem conta? </Text>

        <Pressable onPress={goToLogin}>
          <Text style={styles.link}>Entre aqui </Text>
        </Pressable>
      </View>

      <AlertModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onClose={close}
        onSuccess={() => {
          close();
          modal.onSuccess?.();
        }}
      />
    </SafeAreaView>
  );
}
