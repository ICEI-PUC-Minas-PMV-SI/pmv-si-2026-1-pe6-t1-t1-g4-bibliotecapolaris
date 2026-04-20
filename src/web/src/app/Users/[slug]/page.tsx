'use client';

import { useEffect, useState } from 'react';

import { BookDisplay, BookStatusCard, Footer, Header } from '@/components';

import { getWishlistByUserId } from '@/services/Wishlist';
import { toggleWishlist } from '@/util/ToggleFavorite';

export default function ProfilePage() {
  const [wishlist, setWishlist] = useState<{ books: any[] }>({
    books: [],
  });

  const wishlistSet = new Set((wishlist.books ?? []).map((b) => b.id));

  useEffect(() => {
    async function loadWishlist() {
      const data = await getWishlistByUserId('mock-user-id');
      setWishlist(data ?? { books: [] });
    }

    loadWishlist();
  }, []);

  async function handleToggleWishlist(bookId: string) {
    const userId = 'mock-user-id';
    const isFavorite = wishlistSet.has(bookId);

    await toggleWishlist({
      userId,
      bookId,
      isFavorite,
      setWishlist,
    });
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
            {wishlist.books.map((book: any) => (
              <BookDisplay
                key={book.id}
                title={book.name}
                description={book.description}
                imageSrc="/assets/images/mock-book.png"
                isFavorite={wishlistSet.has(book.id)}
                onToggleFavorite={() => handleToggleWishlist(book.id)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
