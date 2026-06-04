import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { styles } from '@/styles/UserBySlug';

import { Header } from '@/components/Global/Header';
import { BookStatusCard } from '@/components/Book/BookStatusCard';
import { BookDisplay } from '@/components/Book/BookDisplay';
import { AlertModal } from '@/components/Global/AlertModal';
import { ReviewModal } from '@/components/Book/ReviewModal';
import { AdjustLoanModal } from '@/components/Form/AdjustLoan/AdjustLoanModal';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';
import { getLoansByUserId, returnLoanStatus, updateLoanDueDate, updateLoan } from '@/services/Loans';
import { createReview, getReviewsByUserId } from '@/services/Book';
import { getUserBySlug } from '@/services/User';
import { useAuth } from '@/context/AuthContext';
import { Loan } from '@/types';
import { ReviewSection } from '@/components/Book/ReviewSection';

export default function ProfilePage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { user, isLoading: authLoading } = useAuth();

  const slugStr = Array.isArray(slug) ? slug[0] : slug;
  const isOwnProfile = !!user && user.slug === slugStr;

  const [profileUserId, setProfileUserId] = useState<string | null>(null);
  const [profileUserName, setProfileUserName] = useState<string>('');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reviewedLoanIds, setReviewedLoanIds] = useState<Set<string>>(new Set());
  const [reviewTarget, setReviewTarget] = useState<Loan | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<Loan | null>(null);
  const [reviews, setReviews] = useState<{ id: string; userName: string; userSlug: string; rating: number; description?: string; date: string }[]>([]);

  const resolvedUserId = isOwnProfile ? (user?.id ?? '') : (profileUserId ?? '');

  const { wishlist, wishlistSet, toggle } = useWishlist(resolvedUserId);
  const { modal, close, showSuccess, showError } = useAlertModal();

  useEffect(() => {
    if (!slugStr) return;
    if (isOwnProfile && user) {
      setProfileUserId(user.id);
      setProfileUserName(user.name);
      return;
    }
    async function loadUser() {
      try {
        const data = await getUserBySlug(slugStr);
        setProfileUserId(data?.id ?? null);
        setProfileUserName(data?.name ?? '');
      } catch {}
    }
    loadUser();
  }, [slugStr, isOwnProfile]);

  async function loadLoans() {
    if (!resolvedUserId) return;
    try {
      const data = await getLoansByUserId(resolvedUserId);
      setLoans(data ?? []);
    } catch (err) {
      console.log('Erro ao carregar empréstimos:', err);
    }
  }

  useEffect(() => {
    if (authLoading || !resolvedUserId) return;
    loadLoans();
  }, [resolvedUserId, authLoading]);

  useEffect(() => {
    if (!resolvedUserId) return;
    async function loadReviews() {
      try {
        const data = await getReviewsByUserId(resolvedUserId);
        const mapped = (data ?? []).map((r: any) => ({
          id: r.id,
          userName: r.loan?.book?.name ?? 'Livro desconhecido',
          userSlug: '',
          rating: r.rating,
          description: r.description,
          date: r.date,
        }));
        setReviews(mapped);
        if (isOwnProfile) {
          const ids = new Set<string>((data ?? []).map((r: any) => r.loan?.id));
          setReviewedLoanIds(ids);
        }
      } catch {}
    }
    loadReviews();
  }, [resolvedUserId, isOwnProfile]);

  async function handleAdjustSubmit(loanId: string, action: 'return' | 'extend' | 'justify', payload: string) {
    try {
      const today = new Date();
      const dateIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      if (action === 'extend') {
        await updateLoanDueDate(loanId, payload);
        showSuccess('Sucesso!', 'A data de devolução foi atualizada.');
      } else if (action === 'justify') {
        await updateLoan(loanId, { status: 'overdue', justification: payload });
        showSuccess('Justificativa Salva', 'Sua justificativa foi registrada.');
      } else if (action === 'return') {
        await returnLoanStatus(loanId, dateIso);
      }

      setAdjustTarget(null);
      await loadLoans();
    } catch (err: any) {
      showError('Falha no Ajuste', err?.message ?? 'Ocorreu um erro ao processar sua solicitação.');
      throw err;
    }
  }

  const greeting = isOwnProfile ? `Bem vindo de volta, ${user?.name}` : profileUserName;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.section}>
          <Text style={styles.title}>{greeting}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Livros Emprestados</Text>

          <View style={styles.booksContainer}>
            {loans.length > 0 ? (
              loans.map((loan) => (
                <BookStatusCard
                  key={loan.id}
                  title={loan.book?.name || 'Livro desconhecido'}
                  imageSrc={
                    loan.book?.imageSrc ? { uri: loan.book.imageSrc } : require('@/assets/images/mock-book.png')
                  }
                  dueDate={loan.dueDate}
                  status={loan.status}
                  onAdjustClick={isOwnProfile ? () => setAdjustTarget(loan) : undefined}
                  onReviewClick={isOwnProfile ? () => setReviewTarget(loan) : undefined}
                  hasReview={reviewedLoanIds.has(loan.id)}
                />
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhum empréstimo ativo.</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Livros Favoritados</Text>

          {wishlist.books.length > 0 ? (
            <View style={styles.booksContainer}>
              {wishlist.books.map((book) => (
                <BookDisplay
                  key={book.id}
                  bookId={book.id}
                  title={book.name}
                  slug={book.slug}
                  description={book.description}
                  imageSrc={book.imageSrc ? { uri: book.imageSrc } : require('@/assets/images/mock-book.png')}
                  isFavorite={wishlistSet.has(book.id)}
                  onToggleFavorite={isOwnProfile ? () => toggle(book.id) : undefined}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Nenhum livro favoritado, comece agora!</Text>
          )}
        </View>

        <View style={styles.section}>
          <ReviewSection reviews={reviews} />
        </View>
      </ScrollView>

      {isOwnProfile && adjustTarget && (
        <AdjustLoanModal
          loan={adjustTarget}
          role="student"
          onClose={() => setAdjustTarget(null)}
          onSuccess={handleAdjustSubmit}
        />
      )}

      {isOwnProfile && (
        <ReviewModal
          visible={!!reviewTarget}
          bookTitle={reviewTarget?.book?.name}
          onClose={() => setReviewTarget(null)}
          onSubmit={async (rating, description) => {
            try {
              const today = new Date();
              const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              await createReview({ loanId: reviewTarget!.id, rating, description, date });
              setReviewedLoanIds((prev) => new Set(prev).add(reviewTarget!.id));
              setReviewTarget(null);
              showSuccess('Obrigado!', 'Avaliação enviada com sucesso!');
            } catch (err: any) {
              showError('Erro', err?.message ?? 'Erro ao enviar avaliação.');
            }
          }}
        />
      )}

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
