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
import { useAuth } from '@/context/AuthContext';

import { getBookBySlug, getReviewsByBookId } from '@/services/Book';
import { getLoansByUserId } from '@/services/Loans';
import { AddLoanModal } from '@/components/Form/AddLoanModal';

import { formatCategories } from '@/util/validators';

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
  const { user, isLoading: authLoading } = useAuth();

  const [book, setBook] = useState<BookOptional | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState(false);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [hasActiveLoan, setHasActiveLoan] = useState(false);

  const { wishlistSet, toggle } = useWishlist(user?.id ?? '');
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

  async function checkActiveLoan(userId: string, bookId: string) {
    try {
      const loans = await getLoansByUserId(userId);

      const active = (loans ?? []).some(
        (l: any) => l.bookId === bookId && ['pending', 'in_progress', 'overdue'].includes(l.status),
      );

      setHasActiveLoan(active);
    } catch {
      // ignora
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id || !book?.id) return;

    checkActiveLoan(user.id, book.id);
  }, [user?.id, book?.id, authLoading]);
  
  useEffect(() => {
    setError(false);
  }, [book?.imageSrc]);

  if (!book) return null;


const fallback = require('@/assets/images/mock-book.png');

const hasImage =
  typeof book.imageSrc === 'string' &&
  book.imageSrc.trim().length > 0;

const imgSource =
  error || !hasImage
    ? fallback
    : { uri: book.imageSrc };

  const buttonTitle = !user
    ? 'Entre para Retirar'
    : hasActiveLoan
      ? 'Empréstimo Ativo'
      : book.totalAvailable! > 0
        ? 'Retirar'
        : 'Nenhum livro disponível';

  const isDisabled = !user || hasActiveLoan || book.totalAvailable === 0;

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
            {formatCategories(book.categories)}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={8}>
          {book.description}
        </Text>

        <Text style={styles.available} numberOfLines={1}>
          Cópias Disponíveis: {book.totalAvailable}
        </Text>

        <ActionButton
          title={buttonTitle}
          style={{ width: '100%', minHeight: 48 }}
          textStyle={{ fontSize: 20 }}
          disabled={isDisabled}
          onPress={() => {
            if (!user) {
              showError('Atenção', 'Faça login para solicitar um empréstimo.');
              return;
            }
            setLoanModalOpen(true);
          }}
        />

        <ReviewSection reviews={reviews} />
      </ScrollView>

      <AddLoanModal
        role="student"
        open={loanModalOpen}
        bookId={book?.id}
        bookName={book?.name}
        userId={user?.id}
        onClose={() => setLoanModalOpen(false)}
        onSuccess={() => {
          setLoanModalOpen(false);
          checkActiveLoan(user?.id!, book.id!);
        }}
      />

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
