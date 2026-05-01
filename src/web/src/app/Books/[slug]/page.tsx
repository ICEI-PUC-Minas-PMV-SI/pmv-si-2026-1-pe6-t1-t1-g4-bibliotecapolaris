'use client';

import Image from 'next/image';
import { use, useEffect, useState } from 'react';

import { Footer, Header, LikeButton, WithdrawButton } from '@/components';
import ReviewSection from '@/components/Book/ReviewSection';

import { getBookBySlug, getReviewsByBookId } from '@/services/Books';
import { formatCategories } from '@/util/Formatter';
import { useWishlist } from '@/hooks/useWishlist';

function mapReviews(apiReviews: any[]) {
  return apiReviews.map((r) => ({
    id: r.id,
    userName: r.loan?.student?.name ?? 'Usuário desconhecido',
    userSlug: r.loan?.student?.slug ?? '',
    rating: r.rating,
    description: r.description,
    date: r.date,
  }));
}

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [img, setImg] = useState('/assets/images/mock-book.png');
  const [book, setBook] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  const { wishlistSet, toggle } = useWishlist('mock-user-id');

  useEffect(() => {
    if (book?.imageSrc) {
      setImg(book.imageSrc);
    }
  }, [book]);

  useEffect(() => {
    async function loadBook() {
      const data = await getBookBySlug(slug);
      setBook(data);
    }

    loadBook();
  }, [slug]);

  useEffect(() => {
    if (!book?.id) return;
    async function loadReviews() {
      const data = await getReviewsByBookId(book.id);
      setReviews(mapReviews(data));
    }
    loadReviews();
  }, [book?.id]);

  if (!book) {
    return <h1>Livro não encontrado</h1>;
  }

  return (
    <>
      <Header />
      <main className="flex flex-col bg-(--background)">
        <div className="flex justify-evenly mt-8">
          <figure className="relative w-88 h-105 border border-(--text) rounded-sm">
            <Image
              src={img}
              fill
              alt={`Imagem do livro ${book.name}`}
              onError={() => {
                setImg('/assets/images/mock-book.png');
              }}
              unoptimized
            />
          </figure>

          <section className="flex flex-col gap-6 w-[50%] h-full">
            <div className="flex flex-row justify-between">
              <h1 className="font-serif text-5xl font-medium wrap-break-word tracking-wider line-clamp-1">
                {book.name}
              </h1>
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
        </div>

        <section className="px-16 py-8">
          <ReviewSection reviews={reviews} />
        </section>
      </main>

      <Footer />
    </>
  );
}
