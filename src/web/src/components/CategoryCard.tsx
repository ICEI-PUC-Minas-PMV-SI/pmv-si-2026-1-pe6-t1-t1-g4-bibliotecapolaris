'use client';

import Image from 'next/image';

type CategoryCardProps = {
  title: string;
  imageSrc: string;
};

export function CategoryCard({ title = '', imageSrc = '' }: CategoryCardProps) {
  return (
    <article className="flex flex-col shrink-0 justify-center items-start gap-3 p-4 bg-(--foreground) border border-(--text) rounded-xs w-60 min-w-0">
      <div className="w-full text-center">
        <span className="text-3xl uppercase truncate line-clamp-1">{title}</span>
      </div>

      <figure className="w-1/2 self-center border border-(--text)">
        <Image src={imageSrc} alt={title} width={200} height={300} className="object-cover w-full h-auto" />
      </figure>
    </article>
  );
}
