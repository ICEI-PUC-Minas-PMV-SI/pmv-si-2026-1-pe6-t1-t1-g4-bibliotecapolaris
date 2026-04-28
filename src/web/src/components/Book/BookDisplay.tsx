'use client';

import Image from 'next/image';
import { LikeButton, WithdrawButton } from '@/components';

type BookDisplayProps = {
  title: string;
  description: string;
  imageSrc: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function BookDisplay({
  title = '',
  description = '',
  imageSrc = '',
  isFavorite,
  onToggleFavorite,
}: BookDisplayProps) {
  return (
    <article className="flex flex-col shrink-0 align-center gap-3 p-4 bg-(--foreground) border border-(--text) rounded-xs w-[320px] min-w-0">
      <figure className="w-1/2 self-center border border-(--text) rounded-xs shadow-[4px_4px_8px_0px_#FFF2D633,-4px_4px_16px_0px_#FFF2D633]">
        <Image src={imageSrc} alt={title} width={2000} height={2000} className="object-cover w-full h-auto" />
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
