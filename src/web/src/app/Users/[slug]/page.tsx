'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';
import { useAuth } from '@/context/AuthContext';

import { updateUserName, getUserBySlug } from '@/services/User';

import { ActionButton, BookDisplay, BookStatusCard, Footer, Header } from '@/components';
import { AdjustLoanModal } from '@/components/Book/AdjustLoanModal';
import { ProtectedRoute } from '@/components/Global/ProtectedRoute';

import { Loan, User } from '@/types';

import { updateLoanDueDate, returnLoanStatus, getLoansByUserId } from '@/services/loan';

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { user: authenticatedUser, updateUser } = useAuth();

  const isAdmin = authenticatedUser?.type === 'administrator';

  const { showError, showSuccess, ModalComponent } = useAlertModal();

  const [profileUser, setProfileUser] = useState<User | null>(null);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  const [loans, setLoans] = useState<Loan[]>([]);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const userData = await getUserBySlug(slug);

        setProfileUser(userData);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
      }
    }

    loadProfile();
  }, [slug]);

  useEffect(() => {
    if (!profileUser?.id) return;

    async function loadLoans() {
      try {
        const data = await getLoansByUserId(profileUser?.id ?? '');

        setLoans(data ?? []);
      } catch (err) {
        console.error('Erro ao carregar empréstimos:', err);
      }
    }

    loadLoans();
  }, [profileUser?.id]);

  const { wishlist, wishlistSet, toggle, error, setError } = useWishlist(profileUser?.id ?? '');

  useEffect(() => {
    if (error) {
      showError('Erro ao favoritar', 'Não foi possível atualizar sua lista.');

      setError(null);
    }
  }, [error]);

  if (!authenticatedUser || !profileUser) return null;

  const isOwnProfile = authenticatedUser.id === profileUser.id;

  async function handleSaveName() {
    if (!nameInput.trim()) return;

    setSavingName(true);

    try {
      const { status } = await updateUserName(profileUser?.id ?? '', nameInput.trim());

      if (status === 200 || status === 202) {
        setProfileUser((prev) =>
          prev
            ? {
                ...prev,
                name: nameInput.trim(),
              }
            : null,
        );

        if (isOwnProfile) {
          updateUser({ name: nameInput.trim() });
        }

        setEditingName(false);

        showSuccess('Sucesso!', 'Nome atualizado!');
      } else {
        showError('Erro', 'Não foi possível atualizar o nome.');
      }
    } catch {
      showError('Erro', 'Não foi possível atualizar o nome.');
    } finally {
      setSavingName(false);
    }
  }

  function handleOpenAdjustments(loan: Loan) {
    setSelectedLoan(loan);

    setIsAdjustModalOpen(true);
  }

  async function handleChangeDueDate(newDate: string) {
    if (!selectedLoan) return;

    try {
      await updateLoanDueDate(selectedLoan.id, newDate);

      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === selectedLoan.id
            ? {
                ...loan,
                dueDate: newDate,
              }
            : loan,
        ),
      );

      setIsAdjustModalOpen(false);

      showSuccess('Data Alterada!', 'A data de entrega foi atualizada com sucesso no banco.');
    } catch {
      showError('Erro', 'Não foi possível alterar a data no sistema.');
    }
  }

  async function handleReturnBook() {
    if (!selectedLoan) return;

    try {
      const todayString = new Date().toLocaleDateString('pt-BR');

      await returnLoanStatus(selectedLoan.id, todayString);

      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === selectedLoan.id
            ? {
                ...loan,
                status: 'returned',
              }
            : loan,
        ),
      );

      setIsAdjustModalOpen(false);

      showSuccess('Livro Devolvido!', 'A devolução foi registrada no banco de dados.');
    } catch {
      showError('Erro', 'Não foi possível registrar a devolução.');
    }
  }

  async function handleJustifyAndReturn(justificationText: string) {
    if (!selectedLoan) return;

    try {
      const todayString = new Date().toLocaleDateString('pt-BR');

      await returnLoanStatus(selectedLoan.id, todayString, justificationText);

      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === selectedLoan.id
            ? {
                ...loan,
                status: 'returned',
              }
            : loan,
        ),
      );

      setIsAdjustModalOpen(false);

      showSuccess('Devolução Registrada', 'Justificativa salva com sucesso!');
    } catch {
      showError('Erro', 'Não foi possível salvar a justificativa.');
    }
  }

  return (
    <ProtectedRoute>
      <>
        <Header />

        <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) m-8">
          <section className="flex items-center gap-4">
            {editingName && isOwnProfile ? (
              <>
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="form-input text-2xl w-72"
                  placeholder="Novo nome"
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                />

                <ActionButton
                  title={savingName ? 'Salvando...' : 'Salvar'}
                  variant="fill"
                  disabled={savingName}
                  onClick={handleSaveName}
                  className="text-lg"
                />

                <ActionButton
                  title="Cancelar"
                  variant="outline"
                  onClick={() => setEditingName(false)}
                  className="text-lg"
                />
              </>
            ) : (
              <>
                <h1 className="w-full text-3xl uppercase tracking-wider">
                  {isOwnProfile
                    ? `Bem vindo de volta, ${profileUser.name.split(' ')[0]}`
                    : `Vendo perfil de ${profileUser.name.split(' ')[0]}`}
                </h1>

                {isOwnProfile && (
                  <button
                    onClick={() => {
                      setNameInput(profileUser.name);

                      setEditingName(true);
                    }}
                    className="text-(--button-active) text-sm font-sans underline cursor-pointer ml-2"
                    title="Editar nome"
                  >
                    editar nome
                  </button>
                )}
              </>
            )}
          </section>

          <section className="flex flex-col gap-4 items-center">
            <h1 className="w-full text-3xl uppercase tracking-wider">Livros Emprestados</h1>

            <div className="flex flex-wrap justify-center gap-8 w-full">
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <BookStatusCard
                    key={loan.id}
                    title={loan.book?.name || 'Livro Desconhecido'}
                    imageSrc={loan.book?.imageSrc || '/assets/images/mock-book.png'}
                    dueDate={loan.status === 'pending' ? 'Pendente' : loan.dueDate}
                    status={loan.status}
                    onAdjustClick={
                      loan.status === 'pending'
                        ? undefined
                        : () => {
                            if (!isOwnProfile) {
                              showError('Acesso negado', 'Eeei, esse perfil não é seu');

                              return;
                            }

                            handleOpenAdjustments(loan);
                          }
                    }
                  />
                ))
              ) : (
                <h2 className="w-full font-serif text-2xl uppercase text-center text-gray-500 mt-4">
                  Nenhum empréstimo ativo no momento.
                </h2>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-4 items-center mt-8">
            <h1 className="w-full text-3xl uppercase tracking-wider">Livros Favoritados</h1>

            <div className="flex flex-wrap justify-center gap-4">
              {wishlist.books.length > 0 ? (
                wishlist.books.map((book) => (
                  <BookDisplay
                    key={book.id}
                    bookId={book.id}
                    title={book.name}
                    description={book.description}
                    imageSrc={book.imageSrc ? book.imageSrc : '/assets/images/mock-book.png'}
                    isFavorite={wishlistSet.has(book.id)}
                    onToggleFavorite={() => toggle(book.id)}
                  />
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
            isAdmin={isAdmin}
          />

          {ModalComponent}
        </main>

        <Footer />
      </>
    </ProtectedRoute>
  );
}
