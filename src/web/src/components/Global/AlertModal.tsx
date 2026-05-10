'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

type AlertModalProps = {
  type?: 'error' | 'success' | 'confirmation';
  title: string;
  description?: string;
  onClose: () => void;
  onSuccess?: () => void;
};

const buttonColorMap = {
  success: 'bg-(--status-success)',
  error: 'bg-(--status-error)',
  confirmation: 'bg-(--status-confirmation)',
} as const;

export function AlertModal({ type = 'error', title, description, onClose, onSuccess }: AlertModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  const iconSrc =
    type === 'success'
      ? '/assets/success-icon.svg'
      : type === 'error'
        ? '/assets/warning-icon.svg'
        : '/assets/confirm-icon.svg';

  return (
    <dialog
      ref={dialogRef}
      className="w-[30vw] min-h-[20vh] border border-(--text) rounded-sm 
      backdrop:bg-black/40 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      onClose={onClose}
    >
      <div className="min-w-75 flex flex-col bg-(--background) gap-6">
        <div className="border-b border-(--text) px-4 py-2 bg-(--button-inactive)">
          <h1 className="text-2xl font-semibold tracking-wide line-clamp-1">{title}</h1>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Image src={iconSrc} alt="icon" width={64} height={64} />

          {description && (
            <p className="text-center font-sans font-light text-lg  line-clamp-2 w-full">{description}</p>
          )}
        </div>

        <div className="flex justify-end gap-5 px-4 pb-4 ">
          {type === 'confirmation' ? (
            <>
              <button
                onClick={() => {
                  dialogRef.current?.close();
                  onClose();
                }}
                className="px-5 py-2 rounded-sm border border-(--text) font-medium text-lg uppercase cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  dialogRef.current?.close();
                  onSuccess?.();
                }}
                className="px-4 py-2 rounded-sm bg-(--button-active) font-medium text-lg text-(--background) uppercase cursor-pointer"
              >
                Confirmar
              </button>
            </>
          ) : (
            <div>
              <button
                onClick={() => {
                  dialogRef.current?.close();

                  if (type === 'success') {
                    onSuccess?.();
                  } else {
                    onClose();
                  }
                }}
                className={`px-6 py-2 rounded-sm font-medium text-xl text-(--background) uppercase cursor-pointer ${buttonColorMap[type]}`}
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
