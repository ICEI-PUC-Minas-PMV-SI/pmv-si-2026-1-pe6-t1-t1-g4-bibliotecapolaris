import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/UserBySlug';

import { Header } from '@/components/Global/Header';
import { BookStatusCard } from '@/components/Book/BookStatusCard';
import { BookDisplay } from '@/components/Book/BookDisplay';

import { useWishlist } from '@/hooks/useWishlist';
import { getLoansByUserId } from '@/services/Loans';
import { Loan } from '@/types';

export default function ProfilePage() {
  const { wishlist, wishlistSet, toggle } = useWishlist('mock-user-id');
  const [loans, setLoans] = useState<Loan[]>([]);

  useEffect(() => {
    async function loadLoans() {
      try {
        const data = await getLoansByUserId('mock-user-id');

        setLoans(data ?? []);
      } catch (err) {
        console.log('Erro ao carregar empréstimos:', err);
      }
    }

    loadLoans();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.section}>
          <Text style={styles.title}>Bem vindo de volta, 'Lindão'</Text>
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
    </SafeAreaView>
  );
}
