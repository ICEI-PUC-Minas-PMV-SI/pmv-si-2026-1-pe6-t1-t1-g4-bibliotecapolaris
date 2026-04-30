'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ActionButton } from '@/components';

type AlertModalProps = {
  type?: 'error' | 'success' | 'confirmation';
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm?: () => void;
  isLoading?: boolean;
  confirmText?: string;
  loadingText?: string;
};

export function AlertModal({
  type = 'error',
  title,
  description,
  onClose,
  onConfirm,
  isLoading,
  confirmText = 'Confirmar',
  loadingText = 'Carregando...'
}: AlertModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function handleClose() {
    dialogRef.current?.close();
    onClose();
  }

  const iconSrc =
    type === 'success'
      ? '/assets/success-icon.svg'
      : type === 'error'
        ? '/assets/warning-icon.svg'
        : '/assets/confirm-icon.svg';

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="w-[380px] max-w-[95vw] rounded-none border border-(--text)/40
        bg-(--background) text-(--text)
        backdrop:bg-black/60
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        p-0 outline-none"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-(--text)/20">
          <h2 className="font-serif text-lg uppercase tracking-widest font-bold line-clamp-1">
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
        <div className="px-5 py-6 flex flex-col items-center gap-4">
          <Image src={iconSrc} alt="icon" width={64} height={64} />
          {description && (
            <p className="font-sans text-sm text-(--text)/80 text-center">
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex gap-3">
          {type === 'confirmation' ? (
            <>
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
                onClick={() => onConfirm?.()}
                disabled={isLoading}
                className="w-full"
              />
            </>
          ) : (
            <div>
              <ActionButton
                type="button"
                title="Fechar"
                variant="fill"
                onClick={handleClose}
              />
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
