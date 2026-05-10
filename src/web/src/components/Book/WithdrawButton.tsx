'use client';

import { useState } from 'react';
import Image from 'next/image';

import { ActionButton } from '@/components';
import { useAlertModal } from '@/hooks/useAlertModal';
import { useAuth } from '@/context/AuthContext';
import { createLoan } from '@/services/Loans';

type WithdrawButtonProps = {
  book: { id: string; name: string; imageSrc?: string };
};

function localDateIso(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DURATION_OPTIONS = [
  { label: '7 dias', days: 7 },
  { label: '14 dias', days: 14 },
];

export function WithdrawButton({ book }: WithdrawButtonProps) {
  const { user } = useAuth();
  const { showSuccess, showError, ModalComponent } = useAlertModal();

  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [img, setImg] = useState(book.imageSrc || '/assets/images/mock-book.png');

  function openModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showError('Não autenticado', 'Faça login para retirar um livro.');
      return;
    }
    setDays(7);
    setOpen(true);
  }

  async function handleConfirm() {
    if (!user) return;
    setSubmitting(true);
    try {
      await createLoan(
        {
          bookId: book.id,
          userId: user.id,
          loanDate: localDateIso(0),
          returnDate: localDateIso(days),
        },

        'student',
      );
      setOpen(false);
      showSuccess('Solicitação enviada!', 'Sua retirada foi registrada e aguarda aprovação da biblioteca.');
    } catch (err) {
      showError('Erro', err instanceof Error ? err.message : 'Erro ao solicitar retirada.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <ActionButton title="Retirar" className="flex-1 self-end text-3xl" onClick={openModal} />

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />

          <div
            className="relative z-10 w-105 border border-(--text) rounded-sm bg-(--background) flex flex-col p-6 gap-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-2xl font-serif font-semibold tracking-wide">Retirar livro</h1>

            <div className="flex gap-4 items-center flex-col">
              <figure className="relative w-24 h-32 border border-(--text) rounded-xs shrink-0 overflow-hidden">
                <Image
                  src={img}
                  alt={book.name}
                  fill
                  className="object-cover"
                  onError={() => setImg('/assets/images/mock-book.png')}
                />
              </figure>
              <p className="font-serif text-2xl font-medium line-clamp-3 leading-snug">{book.name}</p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="form-label">Prazo de devolução</span>
              <div className="flex gap-3">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.days}
                    type="button"
                    onClick={() => setDays(opt.days)}
                    className={`flex-1 border rounded-[1.5px] font-serif text-lg font-semibold transition-colors cursor-pointer
                      ${
                        days === opt.days
                          ? 'bg-(--button-active) text-(--button-text-active) border-(--button-active)'
                          : 'bg-(--button-inactive) text-(--button-text-inactive) border-(--text) hover:bg-(--button-hover-inactive)'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <span className="text-sm text-(--text) opacity-70">
                Devolução até: {localDateIso(days).split('-').reverse().join('/')}
              </span>
            </div>

            <div className="flex gap-3">
              <ActionButton title="Cancelar" variant="outline" onClick={() => setOpen(false)} className="flex-1" />
              <ActionButton
                title={submitting ? 'Aguarde...' : 'Confirmar'}
                variant="fill"
                onClick={handleConfirm}
                disabled={submitting}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      )}

      {ModalComponent}
    </>
  );
}
