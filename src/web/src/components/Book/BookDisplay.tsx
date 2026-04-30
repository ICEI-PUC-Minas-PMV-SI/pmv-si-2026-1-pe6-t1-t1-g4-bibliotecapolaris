'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LikeButton, WithdrawButton } from '@/components';

type BookDisplayProps = {
  title: string;
  description: string;
  imageSrc?: string | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function BookDisplay({
  title = '',
  description = '',
  imageSrc,
  isFavorite,
  onToggleFavorite,
}: BookDisplayProps) {

  const [error, setError] = useState(false);
  const finalImageSrc = error || !imageSrc ? '/assets/images/mock-book.png' : imageSrc;

  return (
    <article className="flex flex-col shrink-0 items-center gap-3 p-4 bg-(--foreground) border border-(--text) rounded-xs w-[320px] h-[550px] min-w-0">
      <figure className="w-44 h-64 shrink-0 self-center border border-(--text) rounded-xs shadow-[4px_4px_8px_0px_#FFF2D633,-4px_4px_16px_0px_#FFF2D633] overflow-hidden relative">
        <Image 
          src={finalImageSrc} 
          onError={() => setError(true)} 
          alt={title} 
          fill
          className="object-cover" 
        />
      </figure>

      <div className="flex flex-col gap-2 w-full flex-grow overflow-hidden">
        <h1 className="w-full truncate font-serif font-semibold text-2xl text-(--text) text-center tracking-wider shrink-0" title={title}>
          {title}
        </h1>

        <p className="w-full font-sans text-sm text-(--text) text-justify overflow-hidden line-clamp-6">
          {description}
        </p>
      </div>

      <div className="flex gap-2 w-full mt-auto shrink-0">
        <WithdrawButton />

        <LikeButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </div>
    </article>
  );
}
