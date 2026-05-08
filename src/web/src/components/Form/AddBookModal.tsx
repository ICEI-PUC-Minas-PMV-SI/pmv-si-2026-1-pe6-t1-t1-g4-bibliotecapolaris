import { useEffect, useState } from 'react';
import Image from 'next/image';

import { ActionButton } from '@/components';
import { useFormState } from '@/hooks/useFormState';
import { BaseField, BaseInputModal } from './BaseInput';

import { addNewBook, updateBook } from '@/services/Books';
import { type BookForm, initialBookForm } from '@/types/formTypes';
import { useAlertModal } from '@/hooks/useAlertModal';

type AddBookModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;

  mode?: 'create' | 'edit';
  initialData?: BookForm;
};

export function AddBookModal({
  open = false,
  onClose,
  onSuccess,
  mode = 'create',
  initialData = initialBookForm,
}: AddBookModalProps) {
  const { form, setForm, handleChange } = useFormState<BookForm>(initialBookForm);
  const { showSuccess, showError, ModalComponent } = useAlertModal();

  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const clean = (form.isbn ?? '').replace(/-/g, '').trim();

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

  useEffect(() => {
    if (!open) return;

    const data = mode === 'edit' && initialData ? { ...initialBookForm, ...initialData } : initialBookForm;

    setForm(data);
  }, [open]);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    const clean = (form.isbn ?? '').replace(/-/g, '').trim();

    const finalCoverUrl =
      clean.length >= 10 ? `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false` : '';

    try {
      if (mode === 'edit') {
        await updateBook(form.id, form);
      } else {
        await addNewBook({
          ...form,
          imageSrc: finalCoverUrl,
        });
      }

      showSuccess('Sucesso!', 'Livro adicionado com sucesso!', () => {
        onSuccess?.();
        onClose();
      });
    } catch (err) {
      showError('Erro!', err instanceof Error ? err.message : 'Erro ao adicionar livro');
    }
  }

  return (
    <BaseInputModal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Adicionar um novo livro' : 'Atualizar livro'}
    >
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
            placeholder="Universo em numa casca de noz"
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
            placeholder="Estudos, Física"
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
              name="totalAvailable"
              value={form.totalAvailable}
              type="number"
              min={1}
              max={form.totalQuantity}
              onChange={handleChange}
              className="form-input w-24"
            />
          </BaseField>
        </div>

        <ActionButton
          title={mode === 'create' ? 'Adicionar' : 'Atualizar'}
          type="submit"
          variant="fill"
          className="h-12 text-3xl rounded-sm"
        />
      </form>

      {ModalComponent}
    </BaseInputModal>
  );
}
