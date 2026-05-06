import Image from 'next/image';

import { ActionButton, resolveBookStatus } from '@/components';
import { useState } from 'react';

export function BookCell(params: any) {
  const { imageSrc, name } = params.data ?? {};
  const [img, setImg] = useState(imageSrc || '/assets/images/mock-book.png');

  return (
    <div className="flex items-center w-full gap-10 h-full">
      <figure className="relative min-w-12 h-full">
        <Image
          src={img}
          alt={name || 'Capa do livro'}
          fill
          onError={() => {
            setImg('/assets/images/mock-book.png');
          }}
        />
      </figure>
      <span className="leading-none">{name}</span>
    </div>
  );
}

export function DeleteButtonCell(params: any) {
  const handleDelete = (e: any) => {
    e.stopPropagation();

    params.context?.handleDeleteRequest?.(params.data);
  };

  return (
    <ActionButton
      icon="assets/trash-icon.svg"
      variant="outline"
      onClick={handleDelete}
      className="border-0 border-transparent"
    />
  );
}

export function LoanActionsCell(params: any) {
  const handleAccept = (e: any) => {
    e.stopPropagation();
    params.context?.handleLoanAction?.(params.data, 'returned');
  };

  const handleReject = (e: any) => {
    e.stopPropagation();
    params.context?.handleLoanAction?.(params.data, 'canceled');
  };

  return (
    <div className="flex gap-2">
      <ActionButton title="Rejeitar" onClick={handleReject} className="bg-(--status-error)! border!" />
      <ActionButton title="Aceitar" onClick={handleAccept} className="bg-(--status-success)! border!" />
    </div>
  );
}

export function StatusCell(params: any) {
  const { label, config } = resolveBookStatus(new Date(params.value));

  return (
    <span style={{ backgroundColor: config.color, padding: '8px', border: '1px solid #1F1A18', borderRadius: '2px' }}>
      {label}
    </span>
  );
}
