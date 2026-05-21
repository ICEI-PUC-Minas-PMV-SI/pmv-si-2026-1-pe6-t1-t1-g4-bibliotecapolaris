import React, { useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';

import { router } from 'expo-router';

import { styles } from '@/styles/LoginScreen';

import { useAlertModal } from '@/hooks/useAlertModal';
import { loginUser } from '@/services/User';

import { Header } from '@/components/Global/Header';
import { AlertModal } from '@/components/Global/AlertModal';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showError, modal, close } = useAlertModal();

  function goToSign() {
    router.replace('/sign');
  }

  async function handleLogin() {
    try {
      setIsLoading(true);

      if (!email.trim() || !password.trim()) {
        throw new Error('Preencha todos os campos para continuar.');
      }

      const response = await loginUser(email, password);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.message || 'E-mail ou senha incorretos.');
      }

      router.replace('/');
      
    } catch (err: any) {
      showError('Falha no Login', err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.formContainer}>
        <Text style={styles.title}>ENTRAR</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="JohnDoe@unipolaris.com"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
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
          onPress={handleLogin}
          disabled={isLoading}
          style={[styles.button, isLoading && { opacity: 0.6 }]}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Entrando...' : 'Entrar'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Não tem conta? </Text>

        <Pressable onPress={goToSign}>
          <Text style={styles.link}>Registre aqui</Text>
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