import React, { useEffect, useState } from 'react';

import { View, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';

import { styles } from '@/styles/BookBySlug';

import { BookOptional } from '@/types';

import { Header } from '@/components/Global/Header';
import { LikeButton } from '@/components/Book/LikeButton';
import { AlertModal } from '@/components/Global/AlertModal';
import { ActionButton } from '@/components/Global/ActionButton';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';

import { getBookBySlug } from '@/services/Book';

export default function BookBySlug() {
  const { slug } = useLocalSearchParams();

  const [book, setBook] = useState<BookOptional | null>(null);
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

  if (!book) return null;

  const imgSource = error
    ? require('@/assets/images/mock-book.png')
    : {
        uri: book.imageSrc,
      };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.content}>
        <View style={styles.likeButton}>
          <LikeButton isFavorite={wishlistSet.has(book.id)} onToggle={() => handleToggle(book.id ?? '')} />
        </View>

        <Image source={imgSource} resizeMode="cover" onError={() => setError(true)} style={styles.image} />

        <View style={styles.information}>
          <Text style={styles.title} numberOfLines={1}>
            {book.name}
          </Text>

          <Text style={styles.author} numberOfLines={1}>
            por {book.author.name}
          </Text>

          <Text style={styles.categories} numberOfLines={1}>
            {book.categories}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={8}>
          {`${book.description} ${book.description} ${book.description} ${book.description} ${book.description} ${book.description} ${book.description} ${book.description} ${book.description}  ${book.description} ${book.description} ${book.description} ${book.description} ${book.description} ${book.description} ${book.description} ${book.description} ${book.description}`}
        </Text>

        <Text style={styles.available} numberOfLines={1}>
          Cópias Disponíveis: {book.totalAvailable}
        </Text>

        <ActionButton title="Retirar" style={{ flex: 1, width: '100%', minHeight: 48 }} textStyle={{ fontSize: 20 }} />
      </View>

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
