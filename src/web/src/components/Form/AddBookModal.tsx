import { useEffect, useState } from 'react';
import Image from 'next/image';

import { ActionButton } from '@/components';
import { useFormState } from '@/hooks/useFormState';
import { BaseField, BaseInputModal } from './BaseInput';

import { addNewBook } from '@/services/Books';
import { type BookForm, initialBookForm } from '@/types/formTypes';
import { useAlertModal } from '@/hooks/useAlertModal';

type AddBookModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AddBookModal({ open = false, onClose, onSuccess }: AddBookModalProps) {
  const { form, handleChange } = useFormState<BookForm>(initialBookForm);
  const { showSuccess, showError, ModalComponent } = useAlertModal();

  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const clean = form.isbn.replace(/-/g, '').trim();

      if (clean.length < 10) {
        setCoverUrl(null);
        setCoverError(false);
        return;
      }

      const url = `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false`;

      setCoverUrl(url);
      setCoverError(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [form.isbn]);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const clean = form.isbn.trim();

    const finalCoverUrl =
      clean.length >= 10 ? `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false` : '';

    try {
      await addNewBook({
        ...form,
        imageSrc: finalCoverUrl,
      });

      showSuccess('Sucesso!', 'Livro adicionado com sucesso!', () => {
        onSuccess?.();
        onClose();
      });
    } catch (err) {
      showError('Erro!', err instanceof Error ? err.message : 'Erro ao adicionar livro');
    }
  }

  return (
    <BaseInputModal open={open} onClose={onClose} title="Adicionar um novo livro">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex justify-center">
          <div className="w-24 h-32 border border-(--text)/30 flex items-center justify-center overflow-hidden bg-(--foreground)">
            <Image
              src={coverUrl && !coverError ? coverUrl : '/assets/images/mock-book.png'}
              alt="Capa do livro"
              width={112}
              height={160}
              className="w-full h-full object-cover"
              onError={() => setCoverError(true)}
            />
          </div>
        </div>

        <BaseField label="ISBN">
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            placeholder="9780553802023"
            className="form-input"
            maxLength={13}
          />
        </BaseField>

        <BaseField label="Nome do Livro">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Universe in a nutshell"
            className="form-input"
          />
        </BaseField>

        <BaseField label="Autor">
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Stephen Hawking"
            className="form-input"
          />
        </BaseField>

        <BaseField label="Ano de Publicação">
          <input
            name="year"
            value={form.year}
            type="number"
            min={1900}
            onChange={handleChange}
            placeholder="2001"
            className="form-input"
          />
        </BaseField>

        <BaseField label="Categorias">
          <input
            name="categories"
            value={form.categories}
            onChange={handleChange}
            placeholder="Science, Physics"
            className="form-input"
          />
        </BaseField>

        <BaseField label="Descrição">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            className="form-input overflow-hidden min-h-[12vh] max-h-[19vh] text-justify"
          />
        </BaseField>

        <div className="flex gap-8 justify-between">
          <BaseField label="Qtde. de Cópias" className="items-start" labelClassName="text-base">
            <input
              name="totalQuantity"
              value={form.totalQuantity}
              type="number"
              min={1}
              onChange={handleChange}
              className="form-input w-24"
            />
          </BaseField>

          <BaseField label="Cópias Disponíveis" className="items-end" labelClassName="text-base">
            <input
              name="availableQuantity"
              value={form.availableQuantity}
              type="number"
              min={1}
              max={form.totalQuantity}
              onChange={handleChange}
              className="form-input w-24"
            />
          </BaseField>
        </div>

        <ActionButton title="Adicionar" type="submit" variant="fill" className="h-12 text-3xl rounded-sm" />
      </form>

      {ModalComponent}
    </BaseInputModal>
  );
}
