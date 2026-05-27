import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Theme';

type AlertModalProps = {
  visible: boolean;
  type?: 'error' | 'success' | 'confirmation';
  title: string;
  description?: string;
  onClose: () => void;
  onSuccess?: () => void;
};

const buttonColorMap = {
  success: Colors.statusSuccess,
  error: Colors.statusError,
  confirmation: Colors.buttonTextActive,
} as const;

export function AlertModal({ visible, type = 'error', title, description, onClose, onSuccess }: AlertModalProps) {
  const iconSrc =
    type === 'success'
      ? require('@/assets/success-icon.png')
      : type === 'error'
        ? require('@/assets/warning-icon.png')
        : require('@/assets/confirm-icon.png');

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <View style={styles.content}>
            <Image source={iconSrc} style={styles.icon} />

            {description && (
              <Text style={styles.description} numberOfLines={2}>
                {description}
              </Text>
            )}
          </View>

          {type === 'confirmation' ? (
            <View style={styles.confirmationFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmButton} onPress={onSuccess}>
                <Text style={styles.confirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.singleFooter}>
              <TouchableOpacity
                style={[styles.singleButton, { backgroundColor: buttonColorMap[type] }]}
                onPress={() => {
                  if (type === 'success') onSuccess?.();
                  else onClose();
                }}
              >
                <Text style={styles.singleButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  container: {
    width: '85%',
    backgroundColor: Colors.background,

    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.text,

    overflow: 'hidden',
  },

  header: {
    padding: 12,

    borderBottomWidth: 1,
    borderColor: Colors.text,

    backgroundColor: Colors.buttonInactive,
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    textTransform: 'uppercase',
  },

  content: {
    gap: 12,
    padding: 20,

    alignItems: 'center',
  },

  icon: {
    width: 64,
    height: 64,

    resizeMode: 'contain',
  },

  description: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',

    width: '100%',
  },

  confirmationFooter: {
    flexDirection: 'row',
    justifyContent: 'center',

    gap: 20,
    paddingBottom: 12,
  },

  singleFooter: {
    alignItems: 'flex-end',

    padding: 12,
  },

  cancelButton: {
    width: 140,
    paddingVertical: 8,
    paddingHorizontal: 20,

    borderRadius: 4,

    backgroundColor: Colors.statusError,
  },

  cancelText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  confirmButton: {
    width: 140,

    paddingVertical: 8,
    paddingHorizontal: 20,

    borderRadius: 4,

    backgroundColor: Colors.statusSuccess,
  },

  confirmText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  singleButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,

    borderRadius: 4,

    minWidth: '32%',
  },

  singleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
