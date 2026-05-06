'use client';

import { useEffect, useState } from 'react';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';

import { ActionButton, BookDisplay, BookStatusCard, Footer, Header } from '@/components';
import { AdjustLoanModal } from '@/components/Book/AdjustLoanModal';
import { Loan } from '@/types';

const MOCK_USER_ID = '137dda5c-0a74-4e4a-909a-e9f836162955';

const INITIAL_MOCK_LOANS: Loan[] = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    studentId: MOCK_USER_ID,
    bookId: 'b391786c-45ab-4c28-98e1-d238b725c5d0',
    loanDate: new Date('2026-05-01'),
    dueDate: new Date('2026-05-15'),
    status: 'in_progress',
    book: {
      name: 'The Sudden Stop',
      imageSrc: '/assets/images/mock-book.png',
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    studentId: MOCK_USER_ID,
    bookId: 'a123456c-45ab-4c28-98e1-d238b725c5d1',
    loanDate: new Date('2026-03-01'),
    dueDate: new Date('2026-04-12'),
    status: 'late',
    book: {
      name: 'Arquitetura Limpa',
      imageSrc: '/assets/images/mock-book.png',
    }
  }
];

export default function ProfilePage() {
  const { wishlist, wishlistSet, toggle, error, setError } = useWishlist(MOCK_USER_ID);
  const { showError, showSuccess, ModalComponent } = useAlertModal();

  const [loans, setLoans] = useState<Loan[]>(INITIAL_MOCK_LOANS);

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
      const response = await fetch(`http://localhost:3333/loans/${selectedLoan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: newDate }) 
      });

      if (!response.ok) throw new Error('Erro ao atualizar no banco');

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

      const response = await fetch(`http://localhost:3333/loans/${selectedLoan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'returned', 
          returnDate: todayString 
        })
      });

      if (!response.ok) throw new Error('Erro no banco');

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

      const response = await fetch(`http://localhost:3333/loans/${selectedLoan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'returned', 
          returnDate: todayString,
          justification: justificationText 
        })
      });

      if (!response.ok) throw new Error('Erro no banco');

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

          <div className="flex flex-wrap justify-center gap-8">
            {loans.map((loan) => (
              <div key={loan.id} className="flex flex-col items-center gap-3 bg-[#1e1e1e] p-4 rounded-md border border-gray-800 shadow-md">
                
                <BookStatusCard 
                  title={loan.book.name} 
                  imageSrc={loan.book.imageSrc} 
                  dueDate={loan.dueDate} 
                  status={loan.status}
                  onAdjustClick={() => handleOpenAdjustments(loan)}
                />
                
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 items-center px-8 mt-8">
          <h1 className="w-full text-3xl uppercase tracking-wider">Livros Favoritados</h1>

          <div className="flex flex-wrap justify-center gap-4">
            {wishlist.books.length > 0 ? (
              wishlist.books.map((book: any) => (
                <BookDisplay
                  key={book.id}
                  title={book.name}
                  description={book.description}
                  imageSrc={book.imageSrc ? book.imageSrc : '/assets/images/mock-book.png'}
                  isFavorite={wishlistSet.has(book.id)}
                  onToggleFavorite={() => toggle(book.id)}
                />
              ))
            ) : (
              <h2 className="w-full font-serif text-3xl uppercase text-center">
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