import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import { CardBase } from './CardBase';
import { Colors, Fonts } from '@/constants/Theme';

import type { RequestCardType } from '@/types/index';
import { ActionButton } from '@/components/Global/ActionButton';

type RequestCardProps = {
  data: RequestCardType;

  onPress?: () => void;

  onDelete?: () => void;
};

export function RequestCard({ data, onPress, onDelete }: RequestCardProps) {
  return (
    <CardBase onPress={onPress}>
      <View style={styles.content}>
        <Image source={{ uri: data.imageSrc }} style={styles.image} />

        <View style={styles.information}>
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {data.bookName}
            </Text>

            <Text style={styles.author} numberOfLines={1}>
              por {data.authorName}
            </Text>
          </View>

          <Text style={styles.loanDate} numberOfLines={3}>
            {data.loanDate}
          </Text>
          <View style={styles.buttonsSection}>
            <ActionButton title="Recusar" style={{ backgroundColor: Colors.statusError, flex: 1 }} />
            <ActionButton title="Aceitar" style={{ backgroundColor: Colors.statusSuccess, flex: 1 }} />
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
    gap: 12,
  },

  image: {
    width: 72,
    height: 110,

    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.text,
  },

  information: {
    flex: 1,
    justifyContent: 'space-between',
  },

  headerInfo: {
    flexDirection: 'row',
  },

  title: {
    flex: 1,

    fontSize: 16,
    letterSpacing: 1,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Fonts.serif,
  },

  author: {
    flex: 1,

    fontSize: 14,
    opacity: 0.8,
    color: Colors.text,
    textAlign: 'right',
  },

  loanDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },

  buttonsSection: {
    gap: 12,
    flexDirection: 'row',
  },
});
