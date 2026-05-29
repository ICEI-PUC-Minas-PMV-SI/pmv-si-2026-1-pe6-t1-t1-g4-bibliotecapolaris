import React, { useEffect, useState } from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, TextInput, View, Text, Pressable, ScrollView } from 'react-native';

import { router } from 'expo-router';

import { styles } from '@/styles/HomeScreen';

import { Header } from '@/components/Global/Header';
import { AlertModal } from '@/components/Global/AlertModal';
import { BookDisplay } from '@/components/Book/BookDisplay';
import { CategoryCard } from '@/components/Book/CategoryCard';
import { ActionButton } from '@/components/Global/ActionButton';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';
import { useAuth } from '@/context/AuthContext';

import { getBooks, getCategories } from '@/services/Book';

export default function HomeScreen() {
  const { user } = useAuth();
  const { wishlistSet, toggle } = useWishlist(user?.id ?? '');
  const { showError, modal, close } = useAlertModal();

  const [search, setSearch] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [returnedBooks, returnedCategories] = await Promise.all([getBooks(), getCategories()]);

        setBooks(returnedBooks ?? []);
        setCategories(returnedCategories ?? []);
      } catch (err) {
        console.log('erro load data:', err);
      }
    }

    loadData();
  }, []);

  async function handleToggle(bookId: string) {
    const result = await toggle(bookId);

    if (!result.success) {
      showError('Erro', result.error);
    }
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
                placeholder="Pesquise pelo Título, Autor ou Categoria."
                style={styles.input}
                placeholderTextColor="#999"
              />

              <ActionButton
                title="Buscar"
                onPress={() =>
                  router.push({
                    pathname: '/books',
                    params: {
                      search,
                    },
                  })
                }
              />
            </View>
          </View>
        </View>

        {books.length > 0 ? (
          <View style={styles.booksSection}>
            <Text style={styles.sectionTitle}>Recém Chegados</Text>

            <View style={styles.booksContainer}>
              {books.slice(0, 4).map((book: any) => (
                <Pressable
                  key={book.slug}
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
              ))}
            </View>

            <ActionButton title="Ver mais" onPress={() => router.push('/books')} />
          </View>
        ) : (
          <Text style={styles.emptyText}>Nenhum livro encontrado</Text>
        )}

        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Categorias</Text>

          <View style={styles.categoriesContainer}>
            {categories.slice(0, 5).map((cat) => (
              <Pressable
                key={cat.name}
                onPress={() =>
                  router.push({
                    pathname: '/books',
                    params: {
                      search: cat.name,
                    },
                  })
                }
              >
                <CategoryCard title={cat.name} imageSrc={cat.imageSrc} />
              </Pressable>
            ))}
          </View>
        </View>
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
