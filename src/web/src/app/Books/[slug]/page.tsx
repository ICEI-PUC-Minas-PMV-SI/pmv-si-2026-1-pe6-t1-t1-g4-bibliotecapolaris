import Image from 'next/image';

import { Footer, Header, WithdrawButton } from '@/components';
import { getBookBySlug } from '@/services/Books';

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const book = await getBookBySlug(slug);

  if (!book) {
    return <h1>Livro não encontrado</h1>;
  }

  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex justify-evenly bg-(--background) mt-8">
        {/* IMAGEM */}
        <figure className="relative w-88 h-full border border-(--text) rounded-sm">
          <Image
            src="/assets/images/mock-book.png"
            height={2000}
            width={2000}
            alt="Imagem principal da landing page"
            className="object-cover"
            unoptimized
          />
        </figure>

        {/* CONTEÚDO */}
        <section className="flex flex-col gap-6 w-[50%] h-full">
          <h1 className="font-serif text-5xl font-medium wrap-break-word tracking-wider line-clamp-1">{book.name}</h1>

          <h2 className="font-serif text-4xl font-medium wrap-break-word tracking-wider line-clamp-1">{`Por ${book.author.name}`}</h2>

          <h2 className="font-serif text-3xl font-medium tracking-wider line-clamp-1">
            {book.categories
              .split(',')
              .map((cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1))
              .join(', ')}
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
