import React, { useEffect, useState } from 'react';

import { View, Image, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';

import { styles } from '@/styles/BookBySlug';

import { BookOptional } from '@/types';

import { Header } from '@/components/Global/Header';
import { LikeButton } from '@/components/Book/LikeButton';
import { AlertModal } from '@/components/Global/AlertModal';
import { ActionButton } from '@/components/Global/ActionButton';
import { ReviewSection } from '@/components/Book/ReviewSection';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';

import { getBookBySlug, getReviewsByBookId } from '@/services/Book';

function mapReviews(apiReviews: any[]) {
  return apiReviews.map((r) => ({
    id: r.id,
    userName: r.loan?.student?.name ?? 'Usuário desconhecido',
    userSlug: r.loan?.student?.slug ?? '',
    rating: r.rating,
    description: r.description,
    date: r.date,
  }));
}

export default function BookBySlug() {
  const { slug } = useLocalSearchParams();

  const [book, setBook] = useState<BookOptional | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState(false);

  const { wishlistSet, toggle } = useWishlist('31f004de-617e-4990-bc38-f1afd22ab83a');
  const { showError, modal, close } = useAlertModal();

  async function handleToggle(bookId: string) {
    const result = await toggle(bookId);

    if (!result.success) {
      showError('Erro', result.error);
    }
  }

  useEffect(() => {
    async function loadBook() {
      try {
        if (!slug) return;
        const returnedBook = await getBookBySlug(slug as string);
        setBook(returnedBook);
      } catch (err) {
        console.log('erro livro:', err);
      }
    }

    loadBook();
  }, [slug]);

  useEffect(() => {
    if (!book?.id) return;

    async function loadReviews() {
      try {
        const data = await getReviewsByBookId(book?.id ?? '');
        setReviews(mapReviews(data ?? []));
      } catch (err) {
        console.log('erro reviews:', err);
      }
    }

    loadReviews();
  }, [book?.id]);

  if (!book) return null;

  const imgSource = error
    ? require('@/assets/images/mock-book.png')
    : { uri: book.imageSrc };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.likeButton}>
          <LikeButton isFavorite={wishlistSet.has(book.id)} onToggle={() => handleToggle(book.id ?? '')} />
        </View>

        <Image source={imgSource} resizeMode="cover" onError={() => setError(true)} style={styles.image} />

        <View style={styles.information}>
          <Text style={styles.title} numberOfLines={1}>
            {book.name}
          </Text>

          <Text style={styles.author} numberOfLines={1}>
            por {book.author?.name}
          </Text>

          <Text style={styles.categories} numberOfLines={1}>
            {book.categories}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={8}>
          {book.description}
        </Text>

        <Text style={styles.available} numberOfLines={1}>
          Cópias Disponíveis: {book.totalAvailable}
        </Text>

        <ActionButton title="Retirar" style={{ width: '100%', minHeight: 48 }} textStyle={{ fontSize: 20 }} />

        <ReviewSection reviews={reviews} />
      </ScrollView>

      <AlertModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onClose={close}
        onSuccess={() => {
          close();
          modal.onSuccess?.();
        }}
      />
    </SafeAreaView>
  );
}