import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/AdminScreen';

import { BookCardType, LoanCardType, RequestCardType } from '@/types/index';

import { Header } from '@/components/Global/Header';
import { AddLoanModal } from '@/components/Form/AddLoanModal';
import { BookCard } from '@/components/ControlPanel/BookCard';
import { LoanCard } from '@/components/ControlPanel/LoanCard';
import { ActionButton } from '@/components/Global/ActionButton';
import { RequestCard } from '@/components/ControlPanel/RequestCard';

import { getBooks } from '@/services/Book';

export default function AdminPanel() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'books' | 'requests' | 'loans'>('books');

  const [books, setBooks] = useState<BookCardType[]>([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const [loans, setLoans] = useState<LoanCardType[]>([]);
  const [requests, setRequests] = useState<RequestCardType[]>([]);

  const currentData = selectedTab === 'books' ? books : selectedTab === 'requests' ? requests : loans;

  useEffect(() => {
    async function loadData() {
      try {
        const returnedBooks = await getBooks();

        setBooks(returnedBooks ?? []);
        setRequests([
          {
            id: '1',
            bookName: '1984',
            authorName: 'George Orwell',
            loanDate: '20/05/2026 - 14:30',
            imageSrc: 'https://picsum.photos/200/301',
          },
        ]);
        setLoans([
          {
            id: '1',
            bookName: '1984',
            userName: 'Duque',
            authorName: 'George Orwell',
            returnDate: '30/05/2026',
          },
        ]);
      } catch (err) {
        console.log('erro load data:', err);
      }
    }

    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <View style={styles.section}>
        <Text style={styles.title}>Painel de Controle</Text>

        <View style={styles.buttonsSection}>
          <ActionButton
            title="Livros"
            variant={selectedTab === 'books' ? 'fill' : 'outline'}
            style={styles.addButton}
            onPress={() => setSelectedTab('books')}
          />

          <ActionButton
            title="Solicitações"
            variant={selectedTab === 'requests' ? 'fill' : 'outline'}
            style={styles.addButton}
            onPress={() => setSelectedTab('requests')}
          />
          <ActionButton
            title="Empréstimos"
            variant={selectedTab === 'loans' ? 'fill' : 'outline'}
            style={styles.addButton}
            onPress={() => setSelectedTab('loans')}
          />
        </View>
        {selectedTab !== 'requests' && (
          <ActionButton
            title={selectedTab === 'books' ? 'Adicionar Livro' : 'Adicionar Empréstimo'}
            variant="fill"
            style={styles.addButton}
            onPress={() => {
              setSelectedBook(null);
              setModalOpen(true);
            }}
          />
        )}
      </View>

      <FlatList
        style={styles.flatListStyles}
        contentContainerStyle={{
          paddingBottom: 20,
          gap: 12,
        }}
        data={currentData}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => {
          switch (selectedTab) {
            case 'books':
              return (
                <BookCard
                  data={item}
                  onPress={() => {
                    setSelectedBook(item);
                  }}
                />
              );

            case 'requests':
              return <RequestCard data={item} />;

            case 'loans':
              return <LoanCard data={item} />;

            default:
              return null;
          }
        }}
      />
      <AddLoanModal
        role="administrator"
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => setModalOpen(false)}
      />
    </SafeAreaView>
  );
}
