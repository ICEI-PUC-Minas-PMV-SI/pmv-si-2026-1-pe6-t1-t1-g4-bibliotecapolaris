'use client';

import { useEffect } from 'react';

import { useWishlist } from '@/hooks/useWishlist';
import { useAlertModal } from '@/hooks/useAlertModal';

import { BookDisplay, BookStatusCard, Footer, Header } from '@/components';

export default function ProfilePage() {
  const { wishlist, wishlistSet, toggle, error, setError } = useWishlist('137dda5c-0a74-4e4a-909a-e9f836162955');
  const { showError, ModalComponent } = useAlertModal();

  useEffect(() => {
    if (error) {
      showError('Erro ao favoritar', 'Não foi possível atualizar sua lista.');

      setError(null);
    }
  }, [error]);

  return (
    <>
      <Header />

      <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) m-8">
        <section>
          <h1 className="w-full text-3xl uppercase tracking-wider">Bem vindo de volta, 'Lindão'</h1>
        </section>

        <section className="flex flex-col gap-4 items-center">
          <h1 className="w-full text-3xl uppercase tracking-wider">Livros Emprestados</h1>

          <div className="flex flex-wrap justify-center gap-4">
            <BookStatusCard title="The Sudden Stop" imageSrc="/assets/images/mock-book.png" dueDate={new Date()} />

            <BookStatusCard
              title="The Sudden Stop"
              imageSrc="/assets/images/mock-book.png"
              dueDate={new Date('04/12/2026')}
            />

            <BookStatusCard
              title="The Sudden Stop"
              imageSrc="/assets/images/mock-book.png"
              dueDate={new Date('04/24/2026')}
            />
          </div>
        </section>

        <section className="flex flex-col gap-4 items-center px-8">
          <h1 className="w-full text-3xl uppercase tracking-wider">Livros Favoritados</h1>

          <div className="flex flex-wrap justify-center gap-4">
            {wishlist.books.length > 0 ? (
              wishlist.books.map((book: any) => (
                <BookDisplay
                  key={book.id}
                  title={book.name}
                  description={book.description}
                  imageSrc="/assets/images/mock-book.png"
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

        {ModalComponent}
      </main>

      <Footer />
    </>
  );
}
