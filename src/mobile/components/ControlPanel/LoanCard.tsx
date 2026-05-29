import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { CardBase } from './CardBase';
import { Colors, Fonts } from '@/constants/Theme';

import type { LoanCardType } from '@/types/index';
import { formatDateBR, resolveBookStatus } from '../Book/StatusConfig';

type LoanCardProps = {
  data: LoanCardType;

  onPress?: () => void;

  onDelete?: () => void;
};

export function LoanCard({ data, onPress, onDelete }: LoanCardProps) {
  const { label, config } = resolveBookStatus(data.returnDate, data.status);

  return (
    <CardBase onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.information}>
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {data.bookName}
            </Text>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            Usuário: {data.userName}
          </Text>

          <Text style={styles.loanDate} numberOfLines={3}>
            Data de Retorno: {formatDateBR(data.returnDate)}
          </Text>
          <View
            style={[
              styles.label,
              {
                backgroundColor: config.color,
              },
            ]}
          >
            <Text style={styles.labelText} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </View>
      </View>
    </CardBase>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    width: '100%',
  },

  information: {
    flex: 1,
    gap: 6,
  },

  headerInfo: {
    flexDirection: 'row',
    width: '100%',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Fonts.serif,
    letterSpacing: 1,

    flex: 1,
  },

  author: {
    fontSize: 14,
    opacity: 0.8,
    color: Colors.text,

    flex: 1,
    textAlign: 'right',
  },

  loanDate: {
    fontSize: 14,
    color: Colors.text,
  },

  label: {
    width: 'auto',
    borderRadius: 2,
    paddingVertical: 4,
    paddingHorizontal: 12,

    alignSelf: 'flex-end',
  },

  labelText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: Colors.background,
  },
});
