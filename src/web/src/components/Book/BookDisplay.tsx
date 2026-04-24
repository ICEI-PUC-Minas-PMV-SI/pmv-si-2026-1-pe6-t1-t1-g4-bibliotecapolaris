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
  // Use a local state for the image source to handle fallback on error
  const [error, setError] = useState(false);
  const finalImageSrc = error || !imageSrc ? '/assets/images/mock-book.png' : imageSrc;

  return (
    <article className="flex flex-col shrink-0 align-center gap-3 p-4 bg-(--foreground) border border-(--text) rounded-xs w-[320px] min-w-0">
      <figure className="w-1/2 self-center border border-(--text) rounded-xs overflow-hidden">
        <Image
          src={finalImageSrc}
          alt={title}
          width={2000}
          height={2000}
          className="object-cover w-full h-auto"
          onError={() => setError(true)}
        />
      </figure>

      <h1 className="w-full truncate font-serif font-semibold text-3xl text-(--text) text-center tracking-wider">
        {title}
      </h1>

      <p className="w-full font-sans text-sm text-(--text) text-justify wrap-break-word line-clamp-3">{description}</p>

      <div className="flex gap-2 w-full">
        <WithdrawButton />

        <LikeButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </div>
    </article>
  );
}
