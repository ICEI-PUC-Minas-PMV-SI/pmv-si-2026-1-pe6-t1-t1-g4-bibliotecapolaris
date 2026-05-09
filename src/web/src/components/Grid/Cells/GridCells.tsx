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
    params.context?.handleLoanAction?.(params.data, 'in_progress');
  };

  const handleReject = (e: any) => {
    e.stopPropagation();
    params.context?.handleLoanAction?.(params.data, 'canceled');
  };

  return (
    <div className="flex gap-2">
      <ActionButton title="Recusar" onClick={handleReject} className="bg-(--status-error)! border-0!" />
      <ActionButton title="Aprovar" onClick={handleAccept} className="bg-(--status-success)! border-0!" />
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

export function HistoricoStatusCell(params: any) {
  const { dueDate, returnDate, status } = params.data ?? {};

  let label: string;
  let color: string;

  if (returnDate) {
    const late = returnDate > dueDate;
    label = late ? 'Devolvido com atraso' : 'Devolvido no prazo';
    color = late ? 'var(--status-error)' : 'var(--status-success)';
  } else if (status === 'overdue') {
    label = 'Em atraso — não devolvido';
    color = 'var(--status-error)';
  } else if (status === 'canceled') {
    label = 'Cancelado';
    color = 'var(--status-canceled)';
  } else {
    label = 'Em andamento';
    color = 'var(--status-in-progress)';
  }

  return (
    <span style={{ backgroundColor: color, padding: '8px', border: '1px solid #1F1A18', borderRadius: '2px' }}>
      {label}
    </span>
  );
}
