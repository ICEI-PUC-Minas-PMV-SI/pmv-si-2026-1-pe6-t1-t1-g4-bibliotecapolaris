import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/Global/Header';
import { ActionButton } from '@/components/Global/ActionButton';
import { AddLoanModal } from '@/components/Form/AddLoanModal';

import { styles } from '@/styles/AdminScreen';

export default function AdminPanel() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.section}>
          <Text style={styles.title}>Painel de Controle</Text>
          <Text style={styles.subtitle}>Gerencie os empréstimos da biblioteca</Text>
        </View>

        <ActionButton
          title="Adicionar Empréstimo"
          variant="fill"
          style={styles.addButton}
          onPress={() => setModalOpen(true)}
        />
      </ScrollView>

      <AddLoanModal
        role="administrator"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </SafeAreaView>
  );
}
