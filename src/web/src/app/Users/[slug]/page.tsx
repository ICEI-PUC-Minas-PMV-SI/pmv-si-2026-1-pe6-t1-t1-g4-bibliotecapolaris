'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';

import { BookDisplay, BookStatusCard, Footer, Header } from '@/components';
import { AdjustLoanModal } from '@/components/Book/AdjustLoanModal';
import { Loan } from '@/types';
import { updateLoanDueDate, returnLoanStatus } from '@/services/loan';

const MOCK_USER_ID = '137dda5c-0a74-4e4a-909a-e9f836162955';

export default function ProfilePage() {
  const { wishlist, wishlistSet, toggle, error, setError } = useWishlist(MOCK_USER_ID);
  const { showError, showSuccess, ModalComponent } = useAlertModal();

  const [loans, setLoans] = useState<Loan[]>([]);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    if (error) {
      showError('Erro ao favoritar', 'Não foi possível atualizar sua lista.');
      setError(null);
    }
  }, [error]);

  function handleOpenAdjustments(loan: Loan) {
    setSelectedLoan(loan);
    setIsAdjustModalOpen(true);
  }

  async function handleChangeDueDate(newDate: string) {
    if (!selectedLoan) return;
    try {
      await updateLoanDueDate(selectedLoan.id, newDate);

      const [year, month, day] = newDate.split('-').map(Number);
      const adjustedDate = new Date(year, month - 1, day);

      setLoans((prev) => prev.map((loan) => loan.id === selectedLoan.id ? { ...loan, dueDate: adjustedDate } : loan));
      setIsAdjustModalOpen(false);
      showSuccess('Data Alterada!', 'A data de entrega foi atualizada com sucesso no banco.');
    } catch (error) {
      showError('Erro', 'Não foi possível alterar a data no sistema.');
    }
  }

  async function handleReturnBook() {
    if (!selectedLoan) return;
    try {
      const todayString = new Date().toISOString().split('T')[0]; 
      
      await returnLoanStatus(selectedLoan.id, todayString);

      setLoans((prev) => prev.map((loan) => loan.id === selectedLoan.id ? { ...loan, status: 'returned' } : loan));
      setIsAdjustModalOpen(false);
      showSuccess('Livro Devolvido!', 'A devolução foi registrada no banco de dados.');
    } catch (error) {
      showError('Erro', 'Não foi possível registrar a devolução.');
    }
  }

  async function handleJustifyAndReturn(justificationText: string) {
    if (!selectedLoan) return;
    try {
      const todayString = new Date().toISOString().split('T')[0];

      await returnLoanStatus(selectedLoan.id, todayString, justificationText);

      setLoans((prev) => prev.map((loan) => loan.id === selectedLoan.id ? { ...loan, status: 'returned' } : loan));
      setIsAdjustModalOpen(false);
      showSuccess('Devolução Registrada', 'Justificativa salva com sucesso!');
    } catch (error) {
      showError('Erro', 'Não foi possível salvar a justificativa.');
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) m-8">
        <section>
          <h1 className="w-full text-3xl uppercase tracking-wider">Bem vindo de volta, 'Lindão'</h1>
        </section>

        <section className="flex flex-col gap-4 items-center">
          <h1 className="w-full text-3xl uppercase tracking-wider">Livros Emprestados</h1>

          <div className="flex flex-wrap justify-center gap-8 w-full">
            {loans.length > 0 ? (
              loans.map((loan) => (
                <div key={loan.id} className="flex flex-col items-center gap-3 bg-[#1e1e1e] p-4 rounded-md border border-gray-800 shadow-md">
                  <BookStatusCard 
                    title={loan.book.name || 'Livro Desconhecido'} 
                    imageSrc={loan.book.imageSrc || '/assets/images/mock-book.png'} 
                    dueDate={loan.dueDate} 
                    status={loan.status}
                    onAdjustClick={() => handleOpenAdjustments(loan)}
                  />
                </div>
              ))
            ) : (
              <h2 className="w-full font-serif text-2xl uppercase text-center text-gray-500 mt-4">
                Nenhum empréstimo ativo no momento.
              </h2>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-4 items-center px-8 mt-8">
          <h1 className="w-full text-3xl uppercase tracking-wider">Livros Favoritados</h1>

          <div className="flex flex-wrap justify-center gap-4">
            {wishlist.books.length > 0 ? (
              wishlist.books.map((book: any) => (
                <Link key={book.slug} href={`/Books/${book.slug}`}>
                  <BookDisplay
                    key={book.id}
                    title={book.name}
                    description={book.description}
                    imageSrc={book.imageSrc ? book.imageSrc : '/assets/images/mock-book.png'}
                    isFavorite={wishlistSet.has(book.id)}
                    onToggleFavorite={() => toggle(book.id)} 
                  />
                </Link>
              ))
            ) : (
              <h2 className="w-full font-serif text-3xl uppercase text-center text-gray-500">
                Nenhum livro favoritado, comece agora!
              </h2>
            )}
          </div>
        </section>

        <AdjustLoanModal 
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          loan={selectedLoan}
          onChangeDueDate={handleChangeDueDate}
          onReturnBook={handleReturnBook}
          onJustifyAndReturn={handleJustifyAndReturn}
        />

        {ModalComponent}
      </main>

      <Footer />
    </>
  );
}