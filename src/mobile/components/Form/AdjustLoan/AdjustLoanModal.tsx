import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

import { BaseInputModal } from '../BaseInput';
import { ActionButton } from '../../Global/ActionButton';
import { Colors } from '@/constants/Theme';

import { Loan } from '@/types';
import { getBookStatus } from '../../Book/StatusConfig';
import { getModalConfig } from './ModalConfig';

type AdjustLoanModalProps = {
  loan: Loan;
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

  const status = getBookStatus(loan.dueDate);

  const config = getModalConfig(loan, role, status);

  useEffect(() => {
    if (config.actionType === 'read_only' && loan.justification) {
      setInputValue(loan.justification);
    }
  }, [config.actionType, loan]);

  function handleDateInput(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 8);

    let display = digits;

    if (digits.length > 4) {
      display = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
      display = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    setInputValue(display);
  }

  async function handleSubmit(overrideAction?: 'return' | 'extend') {
    if (config.actionType === 'read_only') return;

    const currentAction = overrideAction || config.actionType;

    setLoading(true);

    try {
      let finalPayload = '';

      if (currentAction === 'extend') {
        if (inputValue.length !== 10) {
          throw new Error('Digite uma data válida (DD/MM/AAAA).');
        }

        const [d, m, y] = inputValue.split('/');

        finalPayload = `${y}-${m}-${d}`;
      }

      if (currentAction === 'justify') {
        if (!inputValue.trim()) {
          throw new Error('A justificativa não pode ser vazia.');
        }

        finalPayload = inputValue.trim();
      }

      await onSuccess(loan.id, currentAction as 'return' | 'extend' | 'justify', finalPayload);

      setInputValue('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <BaseInputModal open={!!loan} onClose={onClose} title={config.title}>
      <View style={styles.content}>
        <Text style={styles.label}>{config.label}</Text>

        {role === 'admin' && loan.justification && (
          <View style={styles.justificationBox}>
            <Text style={styles.justificationTitle} numberOfLines={1}>
              Justificativa do aluno:
            </Text>

            <Text style={styles.justificationText} numberOfLines={4}>
              {loan.justification}
            </Text>
          </View>
        )}

        {(config.actionType === 'extend' || config.actionType === 'admin_manage') && (
          <TextInput
            value={inputValue}
            onChangeText={handleDateInput}
            placeholder={config.placeholder}
            placeholderTextColor="#999"
            keyboardType="numeric"
            style={styles.input}
          />
        )}

        {(config.actionType === 'justify' || config.actionType === 'read_only') && (
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={config.placeholder}
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={config.actionType !== 'read_only'}
            style={[
              styles.input,
              styles.textArea,
              config.actionType === 'read_only' && {
                opacity: 0.7,
                backgroundColor: 'transparent',
              },
            ]}
          />
        )}

        {config.actionType === 'admin_manage' ? (
          <>
            <Text style={styles.deliveryLabel}>Livro já foi entregue?</Text>

            <ActionButton
              title={loading ? '...' : 'Entrega Concluída'}
              variant="fill"
              onPress={() => handleSubmit('return')}
              disabled={loading}
            />

            <View style={styles.footerButtons}>
              <ActionButton
                title="Cancelar"
                variant="outline"
                onPress={onClose}
                disabled={loading}
                style={styles.footerButton}
              />

              <ActionButton
                title={loading ? '...' : 'Confirmar'}
                variant="fill"
                onPress={() => handleSubmit('extend')}
                disabled={loading}
                style={styles.footerButton}
              />
            </View>
          </>
        ) : config.actionType !== 'read_only' ? (
          <ActionButton
            title={loading ? 'Aguarde...' : config.buttonLabel || ''}
            onPress={() => handleSubmit()}
            disabled={loading}
          />
        ) : null}
      </View>
    </BaseInputModal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingVertical: 8,
  },

  label: {
    fontSize: 16,
    color: Colors.text,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.text,
    padding: 12,
    borderRadius: 4,
    fontSize: 16,
    color: Colors.text,
    backgroundColor: Colors.foreground,
  },

  textArea: {
    minHeight: 100,
  },

  deliveryLabel: {
    fontSize: 16,
    color: Colors.text,
    marginTop: 8,
  },

  footerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  footerButton: {
    flex: 1,
  },

  justificationBox: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    backgroundColor: Colors.foreground,
  },

  justificationTitle: {
    fontWeight: '600',
    marginBottom: 6,
    color: Colors.text,
    textTransform: 'uppercase',
  },

  justificationText: {
    lineHeight: 20,
    overscrollBehaviorX: 'auto',
    color: Colors.text,

    minHeight: 80,
  },
});
