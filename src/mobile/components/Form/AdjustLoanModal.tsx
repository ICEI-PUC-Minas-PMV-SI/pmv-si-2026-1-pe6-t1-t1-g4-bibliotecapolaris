import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { BaseInputModal } from './BaseInput';
import { ActionButton } from '../Global/ActionButton';
import { Colors } from '@/constants/Theme';

import { Loan } from '@/types';
import { getBookStatus } from '../Book/StatusConfig';

type AdjustLoanModalProps = {
  loan: Loan | null;
  role?: 'student' | 'admin';
  onClose: () => void;
  onSuccess: (loanId: string, action: 'return' | 'extend' | 'justify', payload: string) => Promise<void>;
};

export function AdjustLoanModal({ loan, role = 'student', onClose, onSuccess }: AdjustLoanModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInputValue('');
  }, [loan]);

  if (!loan) return null;

  const status = getBookStatus(loan.dueDate);

  let title = '';
  let buttonLabel = '';
  let label = '';
  let placeholder = '';
  let actionType: 'return' | 'extend' | 'justify' | 'read_only' | 'admin_manage' = 'return';

  if (role === 'admin') {
    title = 'Gerenciar Empréstimo';
    label = `Livro: "${loan.book?.name || 'selecionado'}"\n`;
    
    if (loan.justification) {
      label += `\n⚠️ Justificativa do aluno:\n"${loan.justification}"\n`;
    }
    
    label += '\nPara renovar, digite a nova data. Ou apenas confirme a devolução:';
    placeholder = 'Nova Data (DD/MM/AAAA)';
    actionType = 'admin_manage';
  } 
  else {
    switch (status) {
      case 'far_due':
      case 'to_due':
        title = status === 'far_due' ? 'Antecipar Entrega' : 'Alterar Data de Entrega';
        label = 'Nova Data (DD/MM/AAAA):';
        placeholder = 'Ex: 30/12/2026';
        buttonLabel = 'Renovar Empréstimo';
        actionType = 'extend';
        break;

      case 'overdue':
        if (loan.justification) {
          title = 'Justificativa Registrada';
          label = 'Sua justificativa foi enviada:';
          actionType = 'read_only';
          if (!inputValue) setInputValue(loan.justification); 
        } else {
          title = 'Justificar Atraso';
          label = 'Motivo do Atraso:';
          placeholder = 'Descreva o motivo (necessário para regularizar)';
          buttonLabel = 'Enviar Justificativa';
          actionType = 'justify';
        }
        break;
    }
  }

  function handleDateInput(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let display = digits;
    if (digits.length > 4) display = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) display = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setInputValue(display);
  }

  async function handleSubmit(overrideAction?: 'return' | 'extend') {
    if (!loan || actionType === 'read_only') return;
    const currentAction = overrideAction || actionType;

    setLoading(true);
    try {
      let finalPayload = '';

      if (currentAction === 'extend') {
        if (inputValue.length !== 10) throw new Error('Digite uma data válida (DD/MM/AAAA).');
        const [d, m, y] = inputValue.split('/');
        finalPayload = `${y}-${m}-${d}`;
      } else if (currentAction === 'justify') {
        if (!inputValue.trim()) throw new Error('A justificativa não pode ser vazia.');
        finalPayload = inputValue.trim();
      }

      await onSuccess(loan.id, currentAction as any, finalPayload);
      setInputValue(''); 
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseInputModal open={!!loan} onClose={onClose} title={title}>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>

        {(actionType === 'extend' || actionType === 'admin_manage') && (
          <TextInput
            value={inputValue}
            onChangeText={handleDateInput}
            placeholder={placeholder}
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={styles.input}
          />
        )}

        {(actionType === 'justify' || actionType === 'read_only') && (
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={actionType !== 'read_only'} 
            style={[
              styles.input, 
              styles.textArea,
              actionType === 'read_only' && { opacity: 0.7, backgroundColor: 'transparent' }
            ]}
          />
        )}

        {actionType === 'admin_manage' ? (
          <View style={styles.adminButtons}>
            <ActionButton
              title={loading ? '...' : 'Dar Baixa'}
              onPress={() => handleSubmit('return')}
              disabled={loading}
              style={[styles.submitButton, { flex: 1, backgroundColor: Colors.statusSuccess }]}
            />
            <ActionButton
              title={loading ? '...' : 'Renovar'}
              onPress={() => handleSubmit('extend')}
              disabled={loading}
              style={[styles.submitButton, { flex: 1, backgroundColor: Colors.statusWarning }]}
            />
          </View>
        ) : actionType !== 'read_only' ? (
          <ActionButton
            title={loading ? 'Aguarde...' : buttonLabel}
            onPress={() => handleSubmit()}
            disabled={loading}
            style={styles.submitButton}
          />
        ) : null}
      </View>
    </BaseInputModal>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, paddingVertical: 8 },
  label: { fontSize: 16, color: Colors.text },
  input: {
    borderWidth: 1, borderColor: Colors.text, padding: 12, borderRadius: 4,
    fontSize: 16, color: Colors.text, backgroundColor: Colors.foreground,
  },
  textArea: { minHeight: 100 },
  submitButton: { marginTop: 8 },
  adminButtons: { flexDirection: 'row', gap: 12 }
});