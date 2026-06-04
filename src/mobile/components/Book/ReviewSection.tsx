import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Fonts } from '@/constants/Theme';
import { formatDateBR } from './StatusConfig';
import { router } from 'expo-router';

type Review = {
  id: string;
  userName: string;
  userSlug: string;
  rating: number;
  description?: string;
  date: string;
};

type ReviewSectionProps = {
  reviews: Review[];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text
          key={star}
          style={[
            styles.star,
            { color: star <= rating ? Colors.buttonActive : Colors.text, opacity: star <= rating ? 1 : 0.3 },
          ]}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/users/[slug]',
          params: {
            slug: review.userSlug,
          },
        })
      }
    >
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.userName} numberOfLines={1}>
              {review.userName}
            </Text>
            <Text style={styles.date}>{formatDateBR(review.date)}</Text>
          </View>
          <StarRating rating={review.rating} />
        </View>
        {review.description && (
          <Text style={styles.description} numberOfLines={4}>
            {review.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export function ReviewSection({ reviews }: ReviewSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AVALIAÇÕES</Text>
      {reviews.length === 0 ? (
        <Text style={styles.empty}>NENHUMA AVALIAÇÃO CADASTRADA.</Text>
      ) : (
        reviews.map((review) => <ReviewCard key={review.id} review={review} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    letterSpacing: 2,
    fontWeight: '600',
    color: Colors.text,
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
  },
  empty: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Fonts.serif,
    textAlign: 'center',
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    gap: 8,
    padding: 16,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.text,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardHeaderLeft: {
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    fontFamily: Fonts.serif,
    textTransform: 'uppercase',
    borderBottomWidth: 2,
    borderBottomColor: Colors.buttonActive,
    paddingBottom: 2,
  },
  date: {
    fontSize: 16,
    color: Colors.text,
    fontFamily: Fonts.serif,
    opacity: 0.8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.text,
    fontFamily: Fonts.sans,
    textAlign: 'justify',
    opacity: 0.9,

    minHeight: 52,
  },
});
