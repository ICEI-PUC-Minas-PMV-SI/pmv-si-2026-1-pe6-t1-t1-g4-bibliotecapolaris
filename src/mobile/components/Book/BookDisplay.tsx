import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

import { LikeButton } from './LikeButton';
import { ActionButton } from '../Global/ActionButton';

import { Colors, Fonts } from '@/constants/Theme';

type BookDisplayProps = {
  bookId: string;
  title: string;
  description: string;
  imageSrc: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function BookDisplay({ bookId, title, description, imageSrc, isFavorite, onToggleFavorite }: BookDisplayProps) {
  const [error, setError] = useState(false);

  const fallback = require('@/assets/images/mock-book.png');
  const imgSource = error ? fallback : typeof imageSrc === 'string' ? { uri: imageSrc } : imageSrc;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={imgSource} style={styles.image} resizeMode="cover" onError={() => setError(true)} />
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <Text style={styles.description} numberOfLines={4}>
        {description}
      </Text>

      <View style={styles.buttons}>
        <ActionButton title="Retirar" style={{ flex: 1 }} onPress={() => router.push('/')} />

        <LikeButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </View>
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
  },

  imageContainer: {
    alignSelf: 'center',

    width: '50%',
    height: 80,

    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 1,

    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  title: {
    fontSize: 20,
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

  buttons: {
    gap: 8,
    flexDirection: 'row',
    width: '100%',
  },
});
