'use client';

import { useState } from 'react';
import { ActionButton } from '@/components';

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, description: string) => Promise<void>;
  bookTitle?: string;
};

function StarSelector({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`text-4xl ${star <= rating ? 'text-(--button-active)' : 'text-(--text) opacity-30'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function ReviewModal({ isOpen, onClose, onSubmit, bookTitle }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit() {
    if (rating === 0) return;

    setSubmitting(true);

    try {
      await onSubmit(rating, description);
      setRating(0);
      setDescription('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-(--foreground) border border-(--text) rounded-sm p-8 flex flex-col gap-6 w-125">
        <h2 className="font-serif text-3xl uppercase tracking-wider"> Avaliar Livro{bookTitle ? ` - ${bookTitle}` : ''}</h2>

        <div className="flex flex-col gap-2 items-center">
          <label className="font-serif text-2xl uppercase tracking-wider">Nota</label>
          <StarSelector rating={rating} onChange={setRating} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-serif text-2xl uppercase tracking-wider">Comentário</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input h-32 resize-none"
            placeholder="Escreva sua avaliação..."
          />
        </div>

        <div className="flex gap-4 w-full">
          <ActionButton
            title={submitting ? 'Enviando...' : 'Enviar'}
            variant="fill"
            disabled={submitting || rating === 0}
            onClick={handleSubmit}
            className="flex-1"
          />
          <ActionButton title="Cancelar" variant="outline" onClick={onClose} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
