'use client';

import { useState } from 'react';
import { ActionButton } from '@/components';
import { AlertModal } from '@/components';

export function WithdrawButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ActionButton
        title="Retirar"
        className="flex-1 self-end text-3xl"
        onClick={(e: any) => {
          e?.preventDefault?.();
          e?.stopPropagation?.();
          setOpen(true);
        }}
      />

      {open && (
        <AlertModal
          type="confirmation"
          title="Modal aberta!"
          description="Isso é só um teste de abertura."
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
