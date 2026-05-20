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

          <View style={styles.footer}>
            {type === 'confirmation' ? (
              <>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelText}>Cancelar </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.confirmButton, { backgroundColor: buttonColorMap.confirmation }]}
                  onPress={onSuccess}
                >
                  <Text style={styles.confirmText}>Confirmar </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.singleButton, { backgroundColor: buttonColorMap[type] }]}
                onPress={() => {
                  if (type === 'success') onSuccess?.();
                  else onClose();
                }}
              >
                <Text style={styles.singleButtonText}>Fechar </Text>
              </TouchableOpacity>
            )}
          </View>
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
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

    gap: 10,
    padding: 12,
  },

  cancelButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,

    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#333',
  },

  cancelText: {
    fontSize: 16,
    textTransform: 'uppercase',
  },

  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,

    borderRadius: 4,
  },

  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  singleButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,

    borderRadius: 4,

    minWidth: '24%',
  },

  singleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
