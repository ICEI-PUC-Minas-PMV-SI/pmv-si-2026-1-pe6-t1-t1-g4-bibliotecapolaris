import { useEffect, useState } from 'react';
import Image from 'next/image';

import { ActionButton } from '@/components';
import { useFormState } from '@/hooks/useFormState';

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
      setCoverUrl(`https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false`);
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
        await addNewBook({ ...form, imageSrc: finalCoverUrl });
      }
      showSuccess('Sucesso!', mode === 'edit' ? 'Livro atualizado com sucesso!' : 'Livro adicionado com sucesso!', () => {
        onSuccess?.();
        onClose();
      });
    } catch (err) {
      showError('Erro!', err instanceof Error ? err.message : 'Erro ao salvar livro');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative w-[420px] max-h-[90vh] overflow-y-auto bg-(--background) border border-(--text)/20 rounded-sm shadow-2xl">
        <div className="p-6">
          <h1 className="font-serif text-2xl font-bold tracking-widest uppercase mb-6">
            {mode === 'create' ? 'Adicionar Novo Livro' : 'Atualizar Livro'}
          </h1>

          <div className="flex justify-center mb-6">
            <div className="relative w-[140px] h-[200px] border border-(--text)/20 rounded-sm bg-(--text)/5 flex items-center justify-center overflow-hidden">
              {coverUrl && !coverError ? (
                <Image
                  src={coverUrl}
                  alt="Capa do livro"
                  fill
                  className="object-cover"
                  onError={() => setCoverError(true)}
                  unoptimized
                />
              ) : (
                <span className="text-xs text-(--text)/50 text-center px-2 tracking-widest uppercase">
                  {coverError ? 'Capa nao encontrada' : 'Pre-visualizacao da capa'}
                </span>
              )}
            </div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <ModalField label="ISBN">
              <input
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                placeholder="1234-sudden"
                className="modal-input"
                maxLength={13}
              />
            </ModalField>

            <ModalField label="Nome:">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="The Sudden Stop"
                className="modal-input"
              />
            </ModalField>

            <ModalField label="Autor:">
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Alan Wake"
                className="modal-input"
              />
            </ModalField>

            <ModalField label="Categoria">
              <input
                name="categories"
                value={form.categories}
                onChange={handleChange}
                placeholder="Horror, Romance"
                className="modal-input"
              />
            </ModalField>

            <ModalField label="Descrição">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descreva o livro..."
                className="modal-input min-h-[100px] resize-none text-justify"
              />
            </ModalField>

            <ModalField label="Ano">
              <input
                name="year"
                value={form.year}
                type="number"
                min={1}
                onChange={handleChange}
                placeholder="2024"
                className="modal-input"
              />
            </ModalField>

            <div className="flex gap-4">
              <ModalField label="Cópias Totais" className="flex-1">
                <input
                  name="totalQuantity"
                  value={form.totalQuantity}
                  type="number"
                  min={1}
                  onChange={handleChange}
                  className="modal-input"
                />
              </ModalField>
              <ModalField label="Disponíveis" className="flex-1">
                <input
                  name="totalAvailable"
                  value={form.totalAvailable}
                  type="number"
                  min={0}
                  max={form.totalQuantity}
                  onChange={handleChange}
                  className="modal-input"
                />
              </ModalField>
            </div>

            <ActionButton
              title={mode === 'create' ? 'Adicionar' : 'Atualizar'}
              type="submit"
              variant="fill"
              className="h-12 text-2xl tracking-widest rounded-sm mt-2"
            />
          </form>
        </div>
      </div>

      {ModalComponent}
    </div>
  );
}

function ModalField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ''}`}>
      <label className="font-sans text-sm font-bold tracking-widest uppercase text-(--text)">{label}</label>
      {children}
    </div>
  );
}
