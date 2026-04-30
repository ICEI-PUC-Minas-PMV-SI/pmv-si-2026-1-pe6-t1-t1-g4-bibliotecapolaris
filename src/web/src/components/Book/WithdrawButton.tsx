'use client';

import { ActionButton } from '@/components';

import { useAlertModal } from '@/hooks/useAlertModal';

export function WithdrawButton() {
  const { showConfirmation, ModalComponent } = useAlertModal();

  return (
    <>
      <ActionButton
        title="Retirar"
        className="flex-1 self-end text-3xl"
        onClick={(e: any) => {
          e?.preventDefault?.();
          e?.stopPropagation?.();

          showConfirmation('Modal aberta!', 'Isso é só um teste de abertura.', () => {
            console.log('Confirmado!');
          });
        }}
      />

      {ModalComponent}
    </>
  );
}
