import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/UserBySlug';

import { Header } from '@/components/Global/Header';
import { BookStatusCard } from '@/components/Book/BookStatusCard';
import { BookDisplay } from '@/components/Book/BookDisplay';
import { AlertModal } from '@/components/Global/AlertModal';
import { ReviewModal } from '@/components/Book/ReviewModal';
import { AdjustLoanModal } from '@/components/Form/AdjustLoanModal';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';
import { getLoansByUserId, returnLoanStatus, updateLoanDueDate, updateLoan } from '@/services/Loans';
import { createReview, getReviewsByUserId } from '@/services/Book';
import { useAuth } from '@/context/AuthContext';
import { Loan } from '@/types';

export default function ProfilePage() {
  const { user } = useAuth();
  const userId = user?.id ?? '';
  const { isLoading: authLoading } = useAuth();
  
  const { wishlist, wishlistSet, toggle } = useWishlist(userId);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reviewedLoanIds, setReviewedLoanIds] = useState<Set<string>>(new Set());
  
  const [reviewTarget, setReviewTarget] = useState<Loan | null>(null);
  const [adjustTarget, setAdjustTarget] = useState<Loan | null>(null);

  const { modal, close, showSuccess, showError } = useAlertModal();

  async function loadLoans() {
    try {
      const data = await getLoansByUserId(userId);
      setLoans(data ?? []);
    } catch (err) {
      console.log('Erro ao carregar empréstimos:', err);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    loadLoans();
  }, [userId, authLoading]);

  useEffect(() => {
    if (!userId) return;
    async function loadReviews() {
      try {
        const reviews = await getReviewsByUserId(userId);
        const ids = new Set<string>((reviews ?? []).map((r: any) => r.loanId));
        setReviewedLoanIds(ids);
      } catch {
      }
    }
    loadReviews();
  }, [userId]);

  async function handleAdjustSubmit(loanId: string, action: 'return' | 'extend' | 'justify', payload: string) {
    try {
      const today = new Date();
      const dateIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      if (action === 'extend') {
        await updateLoanDueDate(loanId, payload);
        showSuccess('Sucesso!', 'A data de devolução foi estendida.');
      } 
      else if (action === 'justify') {
        await updateLoan(loanId, { status: 'overdue', justification: payload }); 
        showSuccess('Justificativa Salva', 'Sua justificativa foi registrada.');
      }
      else if (action === 'return') {
        // Isso aqui o Estudante nunca vai chamar por causa da regra no Modal, 
        await returnLoanStatus(loanId, dateIso);
      }

      setAdjustTarget(null);
      await loadLoans();
      
    } catch (err: any) {
      showError('Falha no Ajuste', err?.message ?? 'Ocorreu um erro ao processar sua solicitação.');
      throw err;
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.section}>
          <Text style={styles.title}>Bem vindo de volta, {user?.name}</Text>
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
                  onAdjustClick={() => setAdjustTarget(loan)}
                  onReviewClick={() => setReviewTarget(loan)}
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
                  onToggleFavorite={() => toggle(book.id)}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Nenhum livro favoritado, comece agora!</Text>
          )}
        </View>
      </ScrollView>

      <AdjustLoanModal 
        loan={adjustTarget} 
        role="student"
        onClose={() => setAdjustTarget(null)} 
        onSuccess={handleAdjustSubmit} 
      />

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