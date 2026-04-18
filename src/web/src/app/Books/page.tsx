'use client';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { ActionButton, BookDisplay, Footer, Header } from '@/components';

import { getBooks } from '@/services/Books';

export default function Books() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search') ?? '';

  const [search, setSearch] = useState('');
  const [books, setBooks] = useState<any[]>([]);

  const title = searchQuery ? `Resultados para "${searchQuery}"` : 'Livros';

  useEffect(() => {
    if (searchQuery !== search) {
      setSearch(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search === searchQuery) return;

      if (!search) {
        router.replace('/Books', {
          scroll: false,
        });
        return;
      }

      if (search.length < 4) return;

      router.replace(`/Books?search=${encodeURIComponent(search)}`, {
        scroll: false,
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [search, searchQuery]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchQuery) {
        const data = await getBooks();
        setBooks(data ?? []);
        return;
      }

      if (searchQuery.length < 4) {
        setBooks([]);
        return;
      }

      const data = await getBooks(searchQuery);
      setBooks(data ?? []);
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!search.trim() || search.length < 4) return;

    router.replace(`/Books?search=${encodeURIComponent(search)}`);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
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
                onChange={handleChange}
                placeholder="Pesquise pelo Título, Autor, ISBN ou Categoria."
                className="search-input text-3xl"
              />

              <ActionButton title="Buscar" type="submit" className="h-13.5 text-3xl" />
            </form>
          </figure>
        </section>

        {searchQuery.length > 0 && searchQuery.length < 4 ? (
          <h1 className="w-full text-center text-3xl uppercase">Comece a pesquisar com pelo menos 4 caracteres</h1>
        ) : books.length > 0 ? (
          <section className="flex flex-col gap-4 items-center px-8">
            <h1 className="w-full text-3xl uppercase tracking-wider">{title}</h1>

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
          </section>
        ) : (
          <h1 className="w-full font-serif text-3xl uppercase text-center">Nenhum livro encontrado</h1>
        )}
      </main>

      <Footer />
    </>
  );
}
