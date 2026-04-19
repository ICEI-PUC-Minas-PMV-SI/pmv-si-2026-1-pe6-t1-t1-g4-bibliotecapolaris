import Image from 'next/image';

import { ActionButton, resolveBookStatus } from '@/components';

export function BookCell(params: any) {
  const { src, name } = params.value;

  return (
    <div className="flex items-center  w-full gap-10 h-full">
      <Image src={src} alt={name} width={40} height={64} />
      <span className="leading-none">{name}</span>
    </div>
  );
}

export function DeleteButtonCell(params: any) {
  const handleDelete = () => {
    console.log('deletar', params.data);
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
  const handleAccept = () => {
    console.log('aceitou', params.data);
  };

  const handleReject = () => {
    console.log('rejeitou', params.data);
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
