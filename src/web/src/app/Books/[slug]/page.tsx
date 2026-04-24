'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';

import { Footer, Header, LikeButton, WithdrawButton } from '@/components';

import { getBookBySlug } from '@/services/Books';
import { formatCategories } from '@/util/Formatter';
import { useWishlist } from '@/hooks/useWishlist';

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [book, setBook] = useState<any>(null);
  const { wishlistSet, toggle } = useWishlist('mock-user-id');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadBook() {
      const data = await getBookBySlug(slug);
      setBook(data);
    }

    loadBook();
  }, [slug]);

  if (!book) {
    return <h1>Livro não encontrado</h1>;
  }

  const finalImageSrc = imgError || !book.imageSrc ? '/assets/images/mock-book.png' : book.imageSrc;

  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex justify-evenly bg-(--background) mt-8">
        <figure className="relative w-88 h-full border border-(--text) rounded-sm overflow-hidden">
          <Image
            src={finalImageSrc}
            height={2000}
            width={2000}
            alt={book.name}
            className="object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        </figure>

        <section className="flex flex-col gap-6 w-[50%] h-full">
          <div className="flex flex-row justify-between">
            <h1 className="font-serif text-5xl font-medium wrap-break-word tracking-wider line-clamp-1">{book.name}</h1>

            <LikeButton isFavorite={wishlistSet.has(book.id)} onToggle={() => toggle(book.id)} />
          </div>

          <h2 className="font-serif text-4xl font-medium wrap-break-word tracking-wider line-clamp-1">{`Por ${book.author.name}`}</h2>

          <h2 className="font-serif text-3xl font-medium tracking-wider line-clamp-1">
            {formatCategories(book.categories)}
          </h2>

          <p className="font-sans font-light text-lg text-justify -tracking-wide line-clamp-6">{book.description}</p>

          <span className="text-3xl font-medium tracking-wider line-clamp-1">{`${book.totalAvailable} unidades disponíveis`}</span>

          <WithdrawButton />
        </section>
      </main>

      <Footer />
    </>
  );
}
