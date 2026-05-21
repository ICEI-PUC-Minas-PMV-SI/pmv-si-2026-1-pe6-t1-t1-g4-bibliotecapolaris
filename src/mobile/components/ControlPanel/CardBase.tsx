import { Colors } from '@/constants/Theme';
import React, { ReactNode } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

type CardBaseProps = {
  children: ReactNode;
  onPress?: () => void;
};

export function CardBase({ children, onPress }: CardBaseProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',

    padding: 10,
    marginBottom: 12,

    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.text,
  },
});
