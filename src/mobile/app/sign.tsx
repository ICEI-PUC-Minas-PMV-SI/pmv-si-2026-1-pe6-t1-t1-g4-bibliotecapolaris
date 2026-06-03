import React, { useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { router } from 'expo-router';

import { styles } from '@/styles/LoginScreen';

import { Header } from '@/components/Global/Header';
import { AlertModal } from '@/components/Global/AlertModal';

import { useAlertModal } from '@/hooks/useAlertModal';
import { registerUser } from '@/services/User';
import { validateRegistration } from '@/util/validators';

export default function SignScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { showError, showSuccess, modal, close } = useAlertModal();

  function goToLogin() {
    router.replace('/login');
  }

  async function handleSign() {
    try {
      setIsLoading(true);

      validateRegistration(name, email, password);

      const response = await registerUser(name, email, password);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.message || 'Não foi possível concluir o cadastro.');
      }

      showSuccess('Conta Criada!', 'Seu registro foi concluído com sucesso. Faça o login para acessar o acervo.', () =>
        goToLogin(),
      );

    } catch (err: any) {
      showError('Atenção', err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.formContainer}>
        <Text style={styles.title}>REGISTRAR .</Text>

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
          onPress={handleSign}
          disabled={isLoading}
          style={[styles.button, isLoading && { opacity: 0.6 }]}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Registrando... ' : 'Registrar '}</Text>
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