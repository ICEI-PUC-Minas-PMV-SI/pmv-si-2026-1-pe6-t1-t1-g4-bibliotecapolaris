import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { CardBase } from './CardBase';
import { Colors, Fonts } from '@/constants/Theme';

import type { BookCardType } from '@/types/index';
import { formatCategories } from '@/util/validators';

type BookCardProps = {
  data: BookCardType;

  onPress?: () => void;

  onDelete?: () => void;
};

export function BookCard({ data, onPress, onDelete }: BookCardProps) {

   const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [data.imageSrc]);

  const fallback = require('@/assets/images/mock-book.png');

  const hasImage =
    typeof data.imageSrc === 'string' &&
    data.imageSrc.trim().length > 0;

  const imgSource =
    error || !hasImage
      ? fallback
      : { uri: data.imageSrc };

  return (
    <CardBase onPress={onPress}>
      <View style={styles.content}>
        <Image   source={imgSource} onError={() => setError(true)} style={styles.image} />

        <View style={styles.information}>
          <View style={styles.headerInfo}>
            <Text style={styles.title} numberOfLines={1}>
              {data.name}
            </Text>

            <Text style={styles.author} numberOfLines={1}>
              por {data.author.name}
            </Text>
          </View>

          <Text style={styles.category}>{formatCategories(data.categories)}</Text>

          <Text style={styles.description} numberOfLines={3}>
            {data.description}
          </Text>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Image source={require('@/assets/trash-icon.png')} style={styles.deleteIcon} />
        </TouchableOpacity>
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
    gap: 6,
  },

  headerInfo: {
    flexDirection: 'column',
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    fontFamily: Fonts.serif,
    letterSpacing: 1,
  },

  author: {
    fontSize: 14,
    opacity: 0.8,
    color: Colors.text,
  },

  category: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },

  description: {
    fontSize: 11,
    color: Colors.text,
  },

  deleteButton: {
    justifyContent: 'flex-start',
    alignItems: 'center',

    paddingTop: 2,
  },

  deleteIcon: {
    width: 28,
    height: 28,
  },
});
