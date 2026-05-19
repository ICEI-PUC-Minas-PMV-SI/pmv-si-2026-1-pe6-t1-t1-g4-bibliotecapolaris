import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { router } from 'expo-router';

import { ActionButton } from '../Global/ActionButton';
import { LikeButton } from './LikeButton';

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
  const [img, setImg] = useState(imageSrc);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={img}
          style={styles.image}
          resizeMode="cover"
          onError={() => {
            setImg(require('@/assets/images/mock-book.png'));
          }}
        />
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
    borderRadius: 4,

    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: Fonts.serif,
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
