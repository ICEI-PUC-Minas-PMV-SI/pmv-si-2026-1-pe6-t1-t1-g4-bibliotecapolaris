import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/Theme';

type CategoryCardProps = {
  title: string;
  imageSrc: any;
};

export function CategoryCard({ title = '', imageSrc }: CategoryCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={imageSrc} style={styles.image} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 112,

    padding: 12,
    gap: 12,

    borderWidth: 1,
    borderRadius: 4,

    backgroundColor: Colors.foreground,
    borderColor: Colors.text,
  },

  titleContainer: {
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    textTransform: 'uppercase',

    color: Colors.text,
    fontFamily: Fonts.serif,
  },

  imageContainer: {
    width: '50%',
    height: 64,

    alignSelf: 'center',

    borderWidth: 1,
    borderColor: Colors.text,

    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});
