import React from 'react';

import { Image, TextInput, View, Text, Pressable, ScrollView } from 'react-native';

import { ActionButton } from '@/components/Global/ActionButton';
import { Header } from '@/components/Global/Header';

import { styles } from '@/styles/HomeScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useWishlist } from '@/hooks/useWishlist';
import { BookDisplay } from '@/components/Book/BookDisplay';

import { books, categories } from '@/util/MockData';
import { CategoryCard } from '@/components/Book/CategoryCard';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { wishlistSet, toggle } = useWishlist('mock-user');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Header />

        <View style={styles.section}>
          <View style={styles.heroContainer}>
            <Image source={require('@/assets/images/hero.png')} style={styles.heroImage} resizeMode="cover" />

            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Pesquise pelo Título, Autor ou Categoria."
                style={styles.input}
                placeholderTextColor="#999"
              />

              <ActionButton title="Buscar" />
            </View>
          </View>
        </View>

        {books.length > 0 ? (
          <View style={styles.booksSection}>
            <Text style={styles.booksTitle}>Recém Chegados</Text>

            <View style={styles.booksContainer}>
              {books.slice(0, 3).map((book) => (
                <Pressable key={book.slug} onPress={() => router.push(`/`)}>
                  <BookDisplay
                    key={book.slug}
                    bookId={book.id}
                    title={book.name}
                    description={book.description}
                    imageSrc={book.imageSrc}
                    isFavorite={wishlistSet.has(book.id)}
                    onToggleFavorite={() => toggle(book.id)}
                  />
                </Pressable>
              ))}
            </View>

            <ActionButton title="Ver mais" onPress={() => console.log('livros legais')} />
          </View>
        ) : (
          <Text style={styles.emptyText}>Nenhum livro encontrado</Text>
        )}

        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesTitle}>Categorias</Text>

          <View style={styles.categoriesContainer}>
            {categories.slice(0, 5).map((cat) => (
              <Pressable key={cat.name} onPress={() => router.push(`/`)}>
                <CategoryCard title={cat.name} imageSrc={cat.imageSrc} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
