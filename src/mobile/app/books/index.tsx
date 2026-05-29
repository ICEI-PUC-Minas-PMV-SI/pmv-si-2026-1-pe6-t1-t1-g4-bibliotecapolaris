import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, TextInput, View, Text, Pressable, ScrollView, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { styles } from '@/styles/HomeScreen';

import { Header } from '@/components/Global/Header';
import { BookDisplay } from '@/components/Book/BookDisplay';
import { ActionButton } from '@/components/Global/ActionButton';

import { useWishlist } from '@/hooks/useWishlist';
import { getBooks } from '@/services/Book';
import { useAuth } from '@/context/AuthContext';

export default function BooksScreen() {
  const params = useLocalSearchParams<{ search?: string }>();
  const [search, setSearch] = useState(typeof params.search === 'string' ? params.search : '');

  const { user } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const { wishlistSet, toggle } = useWishlist(user?.id ?? '');

  useEffect(() => {
    async function loadBooks() {
      try {
        const returnedBooks = await getBooks(search.trim());

        setBooks(returnedBooks ?? []);
      } catch (err) {
        console.log('erro:', err);
      }
    }

    loadBooks();
  }, [search]);

  async function handleToggle(bookId: string) {
    await toggle(bookId);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.section}>
          <View style={styles.heroContainer}>
            <Image source={require('@/assets/images/hero.png')} style={styles.heroImage} resizeMode="cover" />

            <View style={styles.searchContainer}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Pesquise por título, autor ou categoria"
                style={styles.input}
                placeholderTextColor="#999"
              />

              <ActionButton title="Buscar" onPress={() => {}} />
            </View>
          </View>
        </View>

        <View style={styles.booksSection}>
          <Text style={styles.sectionTitle}>Livros</Text>

          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{
              gap: 12,
              paddingBottom: 20,
            }}
            renderItem={({ item: book }) => (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/books/[slug]',
                    params: {
                      slug: book.slug,
                    },
                  })
                }
              >
                <BookDisplay
                  bookId={book.id}
                  title={book.name}
                  slug={book.slug}
                  description={book.description}
                  imageSrc={book.imageSrc}
                  isFavorite={wishlistSet.has(book.id)}
                  onToggleFavorite={() => handleToggle(book.id)}
                />
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
