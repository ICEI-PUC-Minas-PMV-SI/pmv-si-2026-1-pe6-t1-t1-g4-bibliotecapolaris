import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '../Global/ActionButton';

import { Colors, Fonts } from '@/constants/Theme';
import { resolveBookStatus } from './StatusConfig';

type BookStatusCardProps = {
  title: string;
  imageSrc: any;
  dueDate: Date | string;
  status?: string;

  onAdjustClick?: () => void;
  onReviewClick?: () => void;

  hasReview?: boolean;
};

export function BookStatusCard({
  title,
  imageSrc,
  dueDate,
  status,
  onAdjustClick,
  onReviewClick,
  hasReview,
}: BookStatusCardProps) {
  const { config, label, type } = resolveBookStatus(dueDate, status);

  const isPending = type === 'pending';
  const isReturned = status === 'returned';

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.statusBar,
          {
            backgroundColor: isReturned ? '#6b7280' : config.color,
          },
        ]}
      >
        <Text style={styles.statusText} numberOfLines={1}>
          {isReturned ? 'Devolvido' : label}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={imageSrc} style={styles.image} resizeMode="cover" />
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {!isPending && (
        <>
          {isReturned ? (
            onReviewClick && !hasReview ? (
              <ActionButton
                title="Avaliar"
                style={{
                  backgroundColor: '#6b7280',
                }}
                textStyle={{ fontSize: 10 }}
                onPress={onReviewClick}
              />
            ) : onReviewClick && hasReview ? (
              <ActionButton
                title="Já avaliado"
                disabled
                style={{
                  backgroundColor: '#6b7280',
                }}
                textStyle={{ fontSize: 10 }}
              />
            ) : null
          ) : (
            <ActionButton
              title={config.buttonText}
              style={{
                backgroundColor: config.color,
              }}
              textStyle={{ fontSize: 10 }}
              onPress={onAdjustClick}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 176,

    padding: 16,
    gap: 12,

    borderWidth: 1,
    borderRadius: 4,

    backgroundColor: Colors.foreground,
    borderColor: Colors.text,

    overflow: 'hidden',
  },

  statusBar: {
    marginHorizontal: -16,
    marginTop: -16,

    alignSelf: 'stretch',

    padding: 4,
  },

  statusText: {
    textAlign: 'center',

    color: Colors.buttonTextActive,
    fontWeight: 'bold',
    fontSize: 10,
  },

  imageContainer: {
    alignSelf: 'center',

    width: '50%',
    height: 80,

    borderWidth: 1,
    borderRadius: 4,

    overflow: 'hidden',

    borderColor: Colors.text,
  },

  image: {
    width: '100%',
    height: '100%',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
  },

  description: {
    minHeight: 54,

    textAlign: 'justify',
    fontSize: 12,

    color: Colors.text,
  },
});
