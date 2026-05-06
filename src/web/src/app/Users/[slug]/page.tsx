'use client';

import { use, useEffect, useState } from 'react';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';
import { useAuth } from '@/context/AuthContext';
import { updateUserName } from '@/services/User';

import { BookDisplay, BookStatusCard, Footer, Header, ActionButton } from '@/components';
import { ProtectedRoute } from '@/components/Global/ProtectedRoute';

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const { user, updateUser } = useAuth();
  const { wishlist, wishlistSet, toggle, error, setError } = useWishlist(user?.id ?? '');
  const { showError, showSuccess, ModalComponent } = useAlertModal();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (error) {
      showError('Erro ao favoritar', 'Não foi possível atualizar sua lista.');
      setError(null);
    }
  }, [error]);

  if (!user) return null;

  const isOwnProfile = user.slug === slug;

  async function handleSaveName() {
    if (!nameInput.trim() || !user) return;
    setSavingName(true);
    try {
      const { status } = await updateUserName(user.id, nameInput.trim());
      if (status === 200 || status === 202) {
        updateUser({ name: nameInput.trim() });
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

  return (
    <ProtectedRoute>
      <>
        <Header />

        <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) m-8">
          {/* Boas-vindas + edição de nome */}
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
                <h1 className="text-3xl uppercase tracking-wider">
                  Bem vindo de volta, {user.name.split(' ')[0]}
                </h1>
                {isOwnProfile && (
                  <button
                    onClick={() => { setNameInput(user.name); setEditingName(true); }}
                    className="text-(--button-active) text-sm font-sans underline cursor-pointer ml-2"
                    title="Editar nome"
                  >
                    editar nome
                  </button>
                )}
              </>
            )}
          </section>

          {/* Livros Emprestados */}
          <section className="flex flex-col gap-4 items-center">
            <h1 className="w-full text-3xl uppercase tracking-wider">Livros Emprestados</h1>
            <div className="flex flex-wrap justify-center gap-4">
              <BookStatusCard title="The Sudden Stop" imageSrc="/assets/images/mock-book.png" dueDate={new Date()} />
              <BookStatusCard title="The Sudden Stop" imageSrc="/assets/images/mock-book.png" dueDate={new Date('04/12/2026')} />
              <BookStatusCard title="The Sudden Stop" imageSrc="/assets/images/mock-book.png" dueDate={new Date('04/24/2026')} />
            </div>
          </section>

          {/* Livros Favoritados */}
          <section className="flex flex-col gap-4 items-center px-8">
            <h1 className="w-full text-3xl uppercase tracking-wider">Livros Favoritados</h1>
            <div className="flex flex-wrap justify-center gap-4">
              {wishlist.books.length > 0 ? (
                wishlist.books.map((book: any) => (
                  <BookDisplay
                    key={book.id}
                    title={book.name}
                    description={book.description}
                    imageSrc={book.imageSrc || '/assets/images/mock-book.png'}
                    isFavorite={wishlistSet.has(book.id)}
                    onToggleFavorite={isOwnProfile ? () => toggle(book.id) : undefined}
                  />
                ))
              ) : (
                <h2 className="w-full font-serif text-3xl uppercase text-center">
                  Nenhum livro favoritado, comece agora!
                </h2>
              )}
            </div>
          </section>

          {ModalComponent}
        </main>

        <Footer />
      </>
    </ProtectedRoute>
  );
}
