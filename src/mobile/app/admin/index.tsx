import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Image } from 'react-native';

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
import { AdjustLoanModal } from '@/components/Form/AdjustLoan/AdjustLoanModal';

import { deleteBook, getBooks } from '@/services/Book';
import {
  getLoans,
  getLoansByStatus,
  updateLoan,
  checkOverdueLoans,
  returnLoanStatus,
  updateLoanDueDate,
  deleteLoan,
} from '@/services/Loans';
import { type BookForm } from '@/types/formTypes';
import { useAlertModal } from '@/hooks/useAlertModal';
import { AlertModal } from '@/components/Global/AlertModal';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function AdminPanel() {
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.type !== 'administrator') {
      router.replace('/');
    }
  }, [authLoading, user]);

  const [modalOpen, setModalOpen] = useState(false);
  const { modal, close, showConfirmation, showSuccess, showError } = useAlertModal();

  const [selectedTab, setSelectedTab] = useState<'books' | 'requests' | 'loans'>('books');

  const [books, setBooks] = useState<BookCardType[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookForm | null>(null);

  const [loans, setLoans] = useState<LoanCardType[]>([]);
  const [requests, setRequests] = useState<RequestCardType[]>([]);

  const [rawLoans, setRawLoans] = useState<any[]>([]);
  const [adjustTarget, setAdjustTarget] = useState<any | null>(null);

  const currentData = selectedTab === 'books' ? books : selectedTab === 'requests' ? requests : loans;

  async function loadBooks() {
    try {
      const returnedBooks = await getBooks();
      setBooks(returnedBooks ?? []);
    } catch (err) {
      console.log('erro ao carregar livros:', err);
    }
  }

  async function loadLoansAndRequests() {
    try {
      await checkOverdueLoans();

      const [pendingLoans, otherLoans] = await Promise.all([getLoansByStatus('pending'), getLoans()]);

      setRawLoans(otherLoans ?? []);

      const filteredOtherLoans = (otherLoans ?? []).filter((l: any) => l.status !== 'pending');

      setRequests(
        (pendingLoans ?? []).map((loan: any) => ({
          id: loan.id,
          bookName: loan.book?.name || 'Desconhecido',
          authorName: loan.book?.author?.name || 'Desconhecido',
          loanDate: loan.loanDate || '',
          imageSrc: loan.book?.imageSrc || '',
        })),
      );

      setLoans(
        filteredOtherLoans.map((loan: any) => ({
          id: loan.id,
          bookName: loan.book?.name || 'Desconhecido',
          userName: loan.student?.name || 'Desconhecido',
          authorName: loan.book?.author?.name || 'Desconhecido',
          dueDate: loan.returnDate || loan.dueDate || '',
          loanDate: loan.loanDate || '',
          status: loan.status,
        })),
      );
    } catch (err) {
      console.log('erro load loans:', err);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    async function init() {
      await loadBooks();
      await loadLoansAndRequests();
    }
    init();
  }, [authLoading]);

  async function handleLoanAction(id: string, status: string = 'in_progress') {
    try {
      if (status === 'canceled') {
        await deleteLoan(id);
      } else {
        await updateLoan(id, { status });
      }

      await loadLoansAndRequests();
      showSuccess('Sucesso', 'Solicitação atualizada com sucesso!');
    } catch (error) {
      showError('Erro', 'Não foi possível atualizar a solicitação.');
    }
  }

  async function handleDeleteBook(book: BookForm) {
    showConfirmation('Excluir livro', `Deseja excluir o livro "${book.name}"?`, async () => {
      try {
        const result = await deleteBook(book.id ?? '');

        if (result.status === 200 || result.status === 202 || result.status === 204) {
          await loadBooks();
          showSuccess('Sucesso', `"${book.name}" foi excluído com sucesso!`);
        } else {
          showError('Erro', `Não foi possível excluir "${book.name}".`);
        }
      } catch (err) {
        showError('Erro', `Ocorreu um erro ao excluir "${book.name}".`);
      }
    });
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

  async function handleAdjustSubmit(loanId: string, action: 'return' | 'extend' | 'justify', payload: string) {
    try {
      if (action === 'return') {
        const today = new Date();
        const dateIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        await returnLoanStatus(loanId, dateIso);
        showSuccess('Sucesso!', 'Livro marcado como entregue com sucesso.');
      } else if (action === 'extend') {
        await updateLoanDueDate(loanId, payload);
        showSuccess('Sucesso!', 'A data de devolução foi estendida.');
      }

      setAdjustTarget(null);
      await loadLoansAndRequests();
    } catch (err: any) {
      showError('Erro', err?.message ?? 'Erro ao processar o empréstimo.');
      throw err;
    }
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
              return (
                <RequestCard
                  data={item}
                  onAccept={() => handleLoanAction(item.id)}
                  onReject={() => handleLoanAction(item.id, 'canceled')}
                />
              );

            case 'loans':
              return <LoanCard data={item} onPress={() => setAdjustTarget(rawLoans.find((l) => l.id === item.id))} />;

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
        <AddLoanModal
          role="administrator"
          open={modalOpen}
          onClose={closeModal}
          onSuccess={async () => {
            closeModal();
            await loadLoansAndRequests();
          }}
        />
      )}

      {adjustTarget && (
        <AdjustLoanModal
          loan={adjustTarget}
          role="admin"
          onClose={() => setAdjustTarget(null)}
          onSuccess={handleAdjustSubmit}
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
