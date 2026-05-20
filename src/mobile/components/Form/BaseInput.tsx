import React, { useState } from 'react';
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

          <ScrollView contentContainerStyle={styles.content} nestedScrollEnabled>{children}</ScrollView>
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

// ─── SelectInput ──────────────────────────────────────────────────────────────

export type SelectOption = { value: string; label: string };

type SelectInputProps = {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  loading?: boolean;
};

export function SelectInput({
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  loading = false,
}: SelectInputProps) {
  const [expanded, setExpanded] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View>
      <Pressable
        style={selectStyles.trigger}
        onPress={() => !loading && setExpanded((prev) => !prev)}
        disabled={loading}
      >
        <Text
          style={[selectStyles.triggerText, !selected && selectStyles.placeholder]}
          numberOfLines={1}
        >
          {loading ? 'Carregando...' : (selected?.label ?? placeholder)}
        </Text>
        <Text style={selectStyles.chevron}>{expanded ? '▲' : '▾'}</Text>
      </Pressable>

      {expanded && (
        <ScrollView style={selectStyles.dropdown} nestedScrollEnabled>
          {options.map((item) => (
            <Pressable
              key={item.value}
              style={[selectStyles.option, item.value === value && selectStyles.optionActive]}
              onPress={() => {
                onChange(item.value);
                setExpanded(false);
              }}
            >
              <Text
                style={[selectStyles.optionText, item.value === value && selectStyles.optionTextActive]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const selectStyles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  chevron: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  dropdown: {
    maxHeight: 180,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ccc',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: '#fff',
  },
  option: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionActive: {
    backgroundColor: '#fff2d6',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  optionTextActive: {
    fontWeight: '600',
    color: '#0b0909',
  },
});

// ─── BaseInputModal / BaseField styles ────────────────────────────────────────

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
