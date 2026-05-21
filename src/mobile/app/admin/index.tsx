import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from '@/styles/AdminScreen';

import { BookCardType, LoanCardType, RequestCardType } from '@/types/index';

import { Header } from '@/components/Global/Header';
import { AddLoanModal } from '@/components/Form/AddLoanModal';
import { AddBookModal } from '@/components/Form/AddBookModal';
import { BookCard } from '@/components/ControlPanel/BookCard';
import { LoanCard } from '@/components/ControlPanel/LoanCard';
import { ActionButton } from '@/components/Global/ActionButton';
import { RequestCard } from '@/components/ControlPanel/RequestCard';

import { deleteBook, getBooks } from '@/services/Book';
import { type BookForm } from '@/types/formTypes';
import { useAlertModal } from '@/hooks/useAlertModal';
import { AlertModal } from '@/components/Global/AlertModal';

export default function AdminPanel() {
  const [modalOpen, setModalOpen] = useState(false);
  const { modal, close, showConfirmation, showSuccess, showError } = useAlertModal();

  const [selectedTab, setSelectedTab] = useState<'books' | 'requests' | 'loans'>('books');

  const [books, setBooks] = useState<BookCardType[]>([]);

  const [selectedBook, setSelectedBook] = useState<BookForm | null>(null);

  const [loans, setLoans] = useState<LoanCardType[]>([]);
  const [requests, setRequests] = useState<RequestCardType[]>([]);

  const currentData = selectedTab === 'books' ? books : selectedTab === 'requests' ? requests : loans;

  async function loadBooks() {
    try {
      const returnedBooks = await getBooks();
      setBooks(returnedBooks ?? []);
    } catch (err) {
      console.log('erro ao carregar livros:', err);
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        await loadBooks();
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

  async function handleDeleteBook(book: BookForm) {
    showConfirmation(
      'Excluir livro',
      `Deseja excluir o livro "${book.name}"?`,

      async () => {
        try {
          const result = await deleteBook(book.id ?? '');

          if (result.status === 200 || result.status === 204) {
            await loadBooks();

            showSuccess('Sucesso', `"${book.name}" foi excluído com sucesso!`);
          } else {
            showError('Erro', `Não foi possível excluir "${book.name}".`);
          }
        } catch (err) {
          showError('Erro', `Ocorreu um erro ao excluir "${book.name}".`);
        }
      },
    );
  }

  function openAddModal() {
    setSelectedBook(null);
    setModalOpen(true);
  }

  function openEditModal(book: BookForm) {
    setSelectedBook(book);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedBook(null);
  }

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
            onPress={openAddModal}
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
                    openEditModal(item);
                  }}
                  onDelete={() => handleDeleteBook(item)}
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

      {selectedTab === 'books' && (
        <AddBookModal
          open={modalOpen}
          onClose={closeModal}
          mode={selectedBook ? 'edit' : 'create'}
          initialData={selectedBook ?? undefined}
          onSuccess={() => {
            closeModal();
            loadBooks();
          }}
        />
      )}

      {selectedTab === 'loans' && (
        <AddLoanModal role="administrator" open={modalOpen} onClose={closeModal} onSuccess={closeModal} />
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
