'use client';

import Image from 'next/image';
import { ActionButton, resolveBookStatus } from '@/components';

type BookStatusCardProps = {
  title: string;
  imageSrc: string;
  dueDate: Date | string;
  status?: string;
  onAdjustClick?: () => void;
  onReviewClick?: () => void;
  hasReview?: boolean;
};

export function BookStatusCard({
  title,
  imageSrc,
  dueDate,
  status,
  onAdjustClick,
  onReviewClick,
  hasReview,
}: BookStatusCardProps) {
  const { config, label, type } = resolveBookStatus(dueDate, status);

  const isPending = type === 'pending';
  const isReturned = status === 'returned';

  return (
    <article className="flex flex-col bg-(--foreground) border border-(--text) rounded-xs w-[320px] overflow-hidden">
      <div
        className="w-full text-center p-1"
        style={{
          backgroundColor: isReturned ? '#6b7280' : config.color,
        }}
      >
        <span className="text-xl text-(--button-text-active) line-clamp-1 font-bold">
          {isReturned ? 'Devolvido' : label}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <figure className="w-1/2 self-center border border-(--text) rounded-xs shadow-[4px_4px_8px_0px_#FFF2D633,-4px_4px_16px_0px_#FFF2D633]">
          <Image src={imageSrc} alt={title} width={2000} height={2000} className="object-cover w-full h-auto" />
        </figure>

        <h1 className="text-center font-serif font-semibold text-3xl">{title}</h1>
      </div>

      <div className="px-4 pb-4">
        {!isPending && (
          <>
            {isReturned ? (
              !hasReview ? (
                <ActionButton className="w-full" style={{ backgroundColor: '#6b7280' }}title="Avaliar" onClick={onReviewClick} />
              ) : (
                <ActionButton className="w-full cursor-not-allowed" style={{ backgroundColor: '#6b7280' }} title="Já avaliado" disabled />
              )
            ) : (
              <ActionButton
                className="w-full"
                style={{ backgroundColor: config.color }}
                title={config.buttonText || 'Ajustar Empréstimo'}
                onClick={onAdjustClick}
              />
            )}
          </>
        )}
      </div>
    </article>
  );
}