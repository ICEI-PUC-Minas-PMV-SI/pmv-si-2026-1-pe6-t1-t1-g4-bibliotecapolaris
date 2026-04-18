'use client';

import Image from 'next/image';
import { ActionButton } from '@/components';

type BookDisplayProps = {
  title: string;
  description: string;
  imageSrc: string;
};

export function BookDisplay({ title = '', description = '', imageSrc = '' }: BookDisplayProps) {
  return (
    <article className="flex flex-col shrink-0 align-center gap-3 p-4 bg-(--foreground) border border-(--text) rounded-xs w-[320px] min-w-0">
      <figure className="w-1/2 self-center border border-(--text) rounded-xs">
        <Image src={imageSrc} alt={title} width={2000} height={2000} className="object-cover w-full h-auto" />
      </figure>

      <h1 className="w-full truncate font-serif font-semibold text-3xl text-(--text) text-center tracking-wider">
        {title}
      </h1>

      <p className="w-full font-sans text-sm text-(--text) text-justify wrap-break-word line-clamp-3">{description}</p>

      <div className="flex gap-2 w-full">
        <ActionButton className="flex-1 text-2xl" title="Retirar" />

        <ActionButton icon={'/assets/like-button.svg'} />
      </div>
    </article>
  );
}
