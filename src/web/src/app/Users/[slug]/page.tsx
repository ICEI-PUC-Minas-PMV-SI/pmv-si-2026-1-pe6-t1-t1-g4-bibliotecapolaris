'use client';

import { useEffect, useState } from 'react';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';

import { ActionButton, BookDisplay, BookStatusCard, Footer, Header } from '@/components';
import { AdjustLoanModal } from '@/components/Book/AdjustLoanModal';

const MOCK_USER_ID = '137dda5c-0a74-4e4a-909a-e9f836162955';

const INITIAL_MOCK_LOANS = [
  {
    id: 'loan-123',
    title: 'The Sudden Stop',
    imageSrc: '/assets/images/mock-book.png',
    dueDate: new Date('2026-05-15'),
    status: 'Em andamento',
  },
  {
    id: 'loan-456',
    title: 'Arquitetura Limpa',
    imageSrc: '/assets/images/mock-book.png',
    dueDate: new Date('2026-04-12'),
    status: 'Atrasado',
  }
];

export default function ProfilePage() {
  const { wishlist, wishlistSet, toggle, error, setError } = useWishlist(MOCK_USER_ID);
  const { showError, showSuccess, ModalComponent } = useAlertModal();

  const [loans, setLoans] = useState(INITIAL_MOCK_LOANS);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  useEffect(() => {
    if (error) {
      showError('Erro ao favoritar', 'Não foi possível atualizar sua lista.');
      setError(null);
    }
  }, [error]);

  function handleOpenAdjustments(loan: any) {
    setSelectedLoan(loan);
    setIsAdjustModalOpen(true);
  }

  async function handleAlterarEntrega(newDate: string) {
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

  async function handleAnteciparEntrega() {
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

  async function handleJustificarEDevolver(justificationText: string) {
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
                  title={loan.title} 
                  imageSrc={loan.imageSrc} 
                  dueDate={loan.dueDate} 
                />
                
                <div className="flex flex-col items-center gap-2 w-full">
                  <span className={`font-semibold text-lg ${
                    loan.status === 'Atrasado' ? 'text-red-500' : 
                    loan.status.includes('Devolvido') ? 'text-blue-400' : 'text-green-500'
                  }`}>
                    Status: {loan.status}
                  </span>
                  
                  <ActionButton 
                    title={loan.status.includes('Devolvido') ? "Empréstimo Encerrado" : "Ajustar Empréstimo"} 
                    className={`h-10 w-full text-sm rounded-sm ${loan.status.includes('Devolvido') ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    onClick={() => !loan.status.includes('Devolvido') && handleOpenAdjustments(loan)} 
                    disabled={loan.status.includes('Devolvido')}
                  />
                </div>
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
          onAlterarEntrega={handleAlterarEntrega}
          onAnteciparEntrega={handleAnteciparEntrega}
          onJustificarEDevolver={handleJustificarEDevolver}
        />

        {ModalComponent}
      </main>

      <Footer />
    </>
  );
}