import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

type BaseInputModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function BaseInputModal({ open, title, children, onClose }: BaseInputModalProps) {
  return (
    <Modal visible={open} transparent animationType="fade">
      {/* backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* modal container */}
      <View style={styles.centered}>
        <View style={styles.modal}>
          {title ? (
            <View style={styles.header}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </View>
          ) : null}

          <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

type BaseFieldProps = {
  label: string;
  children: React.ReactNode;
  style?: any;
  labelStyle?: any;
};

export function BaseField({ label, children, style, labelStyle }: BaseFieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modal: {
    width: '85%',
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },

  header: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#eee',
  },

  title: {
    fontSize: 20,
    fontWeight: '600',
  },

  content: {
    padding: 16,
  },

  field: {
    flexDirection: 'column',
    gap: 6,
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
