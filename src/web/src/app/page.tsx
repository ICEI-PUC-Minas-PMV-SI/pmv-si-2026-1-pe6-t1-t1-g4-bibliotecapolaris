'use client';

import { ActionButton } from '@/components/ActionButton';

import Image from 'next/image';
import { Key, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { BookCard } from '@/components/BookCard';
import { getBooks } from '@/database/Books';

export default function LandingPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    async function loadBooks() {
      const returnedBooks = await getBooks();
      setBooks(returnedBooks.data);
    }

    loadBooks();
  }, []);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/books?search=${encodeURIComponent(search)}`);
  }

  return (
    <>
      <Header />

      <main className="flex flex-col gap-6 bg-(--background)">
        <section className="relative z-10 -translate-y-6">
          <figure className="h-[45vh] overflow-hidden">
            <Image
              src="/assets/images/hero-dark.png"
              alt="Imagem principal da landing page"
              fill
              className="object-cover"
              priority
            />
            <form
              onSubmit={handleSubmit}
              className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-[80%] flex items-center gap-8"
            >
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquise pelo Título, Autor, Editora ou Categoria."
                className="search-input text-3xl"
              />

              <ActionButton title="Buscar" type="submit" className="h-13.5 text-3xl" />
            </form>
          </figure>
        </section>
        <section className="flex flex-col gap-4 items-center px-8">
          <h1 className="text-3xl uppercase w-full"> Recém Chegados </h1>

          <div className="flex flex-wrap justify-center gap-4 h-[40%] overflow-y-hidden">
            {books?.length ? (
              books.map((book: any, index: number) => (
                <BookCard
                  key={index}
                  type="display"
                  languages={['PT']}
                  title={book.name}
                  description={book.description}
                  imageSrc="/assets/images/mock-book.png"
                />
              ))
            ) : (
              <h1 className="font-serif text-3xl uppercase"> Nenhum livro encontrado </h1>
            )}
          </div>

          <ActionButton title="Ver mais" />
        </section>
      </main>
    </>
  );
}
