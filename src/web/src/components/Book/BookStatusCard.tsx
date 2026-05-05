'use client';

import Image from 'next/image';
import { ActionButton } from '@/components';

import { resolveBookStatus } from '@/components';

export function BookStatusCard({ title, imageSrc, dueDate }: { title: string; imageSrc: string; dueDate: Date }) {
  const { config, label } = resolveBookStatus(dueDate);

  return (
    <article className="flex flex-col bg-(--foreground) border border-(--text) rounded-xs w-[320px] overflow-hidden">
      <div className="w-full text-center p-1" style={{ backgroundColor: config.color }}>
        <span className="text-xl text-(--button-text-active) line-clamp-1">{label}</span>
      </div>

      <div className="flex flex-col gap-3 p-4">
        <figure className="w-1/2 self-center">
          <Image src={imageSrc} alt={title} width={2000} height={2000} className="object-cover w-full h-auto" />
        </figure>

        <h1 className="text-center font-serif font-semibold text-3xl">{title}</h1>
      </div>

      <div className="px-4 pb-4">
        {/* <ActionButton className="w-full" style={{ backgroundColor: config.color }} title={config.buttonText} /> */}
      </div>
    </article>
  );
}
