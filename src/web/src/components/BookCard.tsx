'use client';

import Image from 'next/image';
import { ActionButton } from './ActionButton';

type BookCardProps = {
  languages: string[];
  title: string;
  description: string;
  imageSrc: string;
  type: 'ebook' | 'display' | 'to_due' | 'expired' | 'far_due';
};

export function BookCard({
  languages = [],
  title = '',
  description = '',
  imageSrc = '',
  type = 'display',
}: BookCardProps) {
  return (
    <article className="flex flex-col shrink-0 justify-center items-start gap-3 p-4 bg-(--foreground) border border-(--text) rounded-xs w-[320px] min-w-0">
      <div className="w-full text-center">
        <span className="text-3xl uppercase truncate line-clamp-1">{languages.join(' ')}</span>
      </div>

      <figure className="w-1/2 self-center">
        <Image src={imageSrc} alt={title} width={2000} height={2000} className="object-cover w-full h-auto" />
      </figure>

      <h1 className="w-full truncate font-serif font-semibold text-3xl text-(--text) text-center ">{title}</h1>

      <p className="w-full max-h-30 font-sans text-sm text-(--text) text-justify wrap-break-word line-clamp-3">
        {description}
      </p>

      <div className="flex gap-2 h-12 w-full">
        <ActionButton className="flex-1" title="Retirar" />

        <ActionButton icon={'/assets/like-button.svg'} />
      </div>
    </article>
  );
}
