'use client';

import Image from 'next/image';
import { ActionButton, resolveBookStatus } from '@/components';

type BookStatusCardProps = {
  title: string;
  imageSrc: string;
  dueDate: Date | string;
  status?: string;
  onAdjustClick?: () => void;
};

export function BookStatusCard({ title, imageSrc, dueDate, status, onAdjustClick }: BookStatusCardProps) {
  const { config, label } = resolveBookStatus(dueDate);

  const isReturned = status === 'returned';

  return (
    <article className="flex flex-col bg-(--foreground) border border-(--text) rounded-xs w-[320px] overflow-hidden">
      <div className="w-full text-center p-1" style={{ backgroundColor: isReturned ? '#6b7280' : config.color }}>
        <span className="text-xl text-(--button-text-active) line-clamp-1">
          {isReturned ? 'Devolvido' : label}
        </span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <figure className="w-1/2 self-center">
          <Image src={imageSrc} alt={title} width={2000} height={2000} className="object-cover w-full h-auto" />
        </figure>

        <h1 className="text-center font-serif font-semibold text-3xl">{title}</h1>
      </div>

      <div className="px-4 pb-4">
        <ActionButton 
          className={`w-full ${isReturned ? 'opacity-50 cursor-not-allowed' : ''}`} 
          style={{ backgroundColor: isReturned ? '#6b7280' : config.color }} 
          title={isReturned ? "Empréstimo Encerrado" : (config.buttonText || "Ajustar Empréstimo")} 
          onClick={isReturned ? undefined : onAdjustClick}
          disabled={isReturned}
        />
      </div>
    </article>
  );
}