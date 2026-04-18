'use client';

import { ActionButton } from '@/components/Global/ActionButton';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BookDisplay, BookStatusCard, CategoryCard, Footer, Header } from '@/components';

import { getBooks } from '@/services/Books';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    async function loadBooks() {
      const returnedBooks = await getBooks();
      setBooks(returnedBooks ?? []);
    }

    loadBooks();
  }, []);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!search.trim()) return;

    router.push(`/Books?search=${encodeURIComponent(search)}`);
  }

  function goToBooks() {
    router.push('/Books');
  }

  return (
    <>
      <Header />

      <main className="min-h-screen flex flex-col gap-6 bg-(--background) mb-8">
        <section className="relative z-10 -translate-y-6">
          <figure className="h-[60vh] relative">
            <Image
              src="/assets/images/hero-dark.png"
              alt="Imagem principal da landing page"
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <form
              onSubmit={handleSubmit}
              className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 w-[80%] flex items-center gap-8"
            >
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquise pelo Título, Autor ou Categoria."
                className="search-input text-3xl"
              />

              <ActionButton title="Buscar" type="submit" className="h-13.5 text-3xl" />
            </form>
          </figure>
        </section>
        {books.length > 0 ? (
          <section className="flex flex-col gap-4 items-center px-8">
            <h1 className="w-full text-3xl uppercase tracking-wider"> Recém Chegados </h1>

            <div className="flex flex-wrap justify-center gap-4">
              {books.map((book: any) => (
                <Link key={book.slug} href={`/Books/${book.slug}`}>
                  <BookDisplay
                    title={book.name}
                    description={book.description}
                    imageSrc="/assets/images/mock-book.png"
                  />
                </Link>
              ))}
            </div>

            <ActionButton title="Ver mais" className="text-2xl" onClick={goToBooks} />
          </section>
        ) : (
          <h1 className="w-full font-serif text-3xl uppercase text-center"> Nenhum livro encontrado </h1>
        )}
        <section className="flex flex-col gap-4 items-center px-8">
          <h1 className="w-full text-3xl uppercase tracking-wider"> Categorias </h1>

          <div className="flex flex-wrap justify-center gap-4">
            <CategoryCard title="Terror" imageSrc="/assets/images/mock-book.png" />
          </div>
        </section>
         
        <section className="flex flex-col gap-4 items-center px-8">
          <h1 className="w-full text-3xl uppercase tracking-wider"> Categorias </h1>         
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
      </main>

      <Footer />
    </>
  );
}
