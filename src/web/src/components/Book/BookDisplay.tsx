'use client';

import { useState } from 'react';
import Image from 'next/image';
import { LikeButton, WithdrawButton } from '@/components';

type BookDisplayProps = {
  bookId: string;
  title: string;
  description: string;
  imageSrc: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function BookDisplay({
  bookId,
  title = '',
  description = '',
  imageSrc = '',
  isFavorite,
  onToggleFavorite,
}: BookDisplayProps) {
  const [img, setImg] = useState(imageSrc);

  return (
    <article className="flex flex-col shrink-0 align-center gap-3 p-4 bg-(--foreground) border border-(--text) rounded-xs w-[320px] min-w-0">
      <figure className="relative w-1/2 h-50 self-center border border-(--text) rounded-xs shadow-[4px_4px_8px_0px_#FFF2D633,-4px_4px_16px_0px_#FFF2D633]">
        <Image
          src={img}
          alt={title}
          fill
          onError={() => {
            setImg('/assets/images/mock-book.png');
          }}
        />
      </figure>

      <h1 className="w-full truncate font-serif font-semibold text-2xl text-(--text) text-center tracking-wider">
        {title}
      </h1>

      <p className="w-full font-sans text-sm text-(--text) text-justify min-h-15 wrap-break-word line-clamp-3 ">
        {description}
      </p>

      <div className="flex gap-2 w-full">
        <WithdrawButton book={{ id: bookId, name: title, imageSrc }} />

        <LikeButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </div>
    </article>
  );
}
