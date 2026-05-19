import React from 'react';
import { FlatList, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/UserBySlug';

import { Header } from '@/components/Global/Header';
import { BookStatusCard } from '@/components/Book/BookStatusCard';
import { BookDisplay } from '@/components/Book/BookDisplay';

import { useWishlist } from '@/hooks/useWishlist';

export default function ProfilePage() {
  const { wishlist, wishlistSet, toggle } = useWishlist('31f004de-617e-4990-bc38-f1afd22ab83a');

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
            <BookStatusCard
              title="The Sudden Stop"
              imageSrc={require('@/assets/images/mock-book.png')}
              dueDate={new Date()}
            />

            <BookStatusCard
              title="The Sudden Stop"
              imageSrc={require('@/assets/images/mock-book.png')}
              dueDate={new Date('2026-04-12')}
            />

            <BookStatusCard
              title="The Sudden Stop"
              imageSrc={require('@/assets/images/mock-book.png')}
              dueDate={new Date('2026-05-24')}
            />
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
