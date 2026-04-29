'use client';

import { useEffect, useRef } from 'react';
import { ActionButton } from '@/components';

type Props = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  confirmText?: string;
  loadingText?: string;
};

export function ConfirmModal({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  isLoading,
  confirmText = 'Confirmar',
  loadingText = 'Carregando...'
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function handleClose() {
    dialogRef.current?.close();
    onCancel();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      className="w-[380px] max-w-[95vw] rounded-none border border-(--text)/40
        bg-(--background) text-(--text)
        backdrop:bg-black/60
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        p-0 outline-none"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-(--text)/20">
          <h2 className="font-serif text-lg uppercase tracking-widest font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar"
            className="text-(--text)/50 hover:text-(--text) transition-colors cursor-pointer text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-6">
          <p className="font-sans text-sm text-(--text)/80 text-center">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          <ActionButton
            type="button"
            title="Cancelar"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="w-full"
          />
          <ActionButton
            type="button"
            title={isLoading ? loadingText : confirmText}
            variant="fill"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      </div>
    </dialog>
  );
}
