'use client';

import { useEffect, useRef } from 'react';
import { ActionButton } from '@/components';

type Props = {
  title: string;
  submitLabel: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
};

export function FormModal({ title, submitLabel, isLoading, onClose, onSubmit, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  function handleClose() {
    dialogRef.current?.close();
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="w-[380px] max-w-[95vw] rounded-none border border-(--text)/40
        bg-(--background) text-(--text)
        backdrop:bg-black/60
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        p-0 outline-none"
    >
      <form onSubmit={onSubmit} className="flex flex-col">
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

        <div className="flex flex-col gap-4 px-5 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        <div className="px-5 pb-5">
          <ActionButton
            type="submit"
            title={submitLabel}
            variant="fill"
            disabled={isLoading}
            className="w-full text-base py-3"
          />
        </div>
      </form>
    </dialog>
  );
}
