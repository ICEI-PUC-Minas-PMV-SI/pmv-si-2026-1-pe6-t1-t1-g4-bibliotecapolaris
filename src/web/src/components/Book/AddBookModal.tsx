'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ActionButton } from '@/components';
import { createBook } from '@/services/Books';
import { createAuthor, getAuthors, type Author } from '@/services/Authors';

type FeedbackState = {
  type: 'success' | 'error';
  message: string;
} | null;

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

export function AddBookModal({ onClose, onSuccess }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  // Author autocomplete
  const [authors, setAuthors] = useState<Author[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [form, setForm] = useState({
    isbn: '',
    name: '',
    categories: '',
    description: '',
    year: new Date().getFullYear(),
    totalQuantity: 1,
    availableQuantity: 1,
  });

  // Cover preview
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    dialogRef.current?.showModal();
    getAuthors().then(setAuthors).catch(() => { });
  }, []);

  // Debounce ISBN → update cover URL (all setState inside setTimeout, never synchronous)
  useEffect(() => {
    const clean = form.isbn.replace(/-/g, '').trim();
    const timer = setTimeout(() => {
      if (clean.length < 10) {
        setCoverUrl(null);
        return;
      }
      setCoverUrl(`https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false`);
    }, 600);
    return () => clearTimeout(timer);
  }, [form.isbn]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const isNumber = name === 'year' || name === 'totalQuantity' || name === 'availableQuantity';
    setForm((prev) => ({ ...prev, [name]: isNumber ? Number(value) : value }));
  }

  // Author suggestion filter
  const suggestions = authorInput.length >= 2
    ? authors.filter((a) => a.name.toLowerCase().includes(authorInput.toLowerCase()))
    : [];

  function handleAuthorSelect(author: Author) {
    setAuthorInput(author.name);
    setAuthorId(author.id);
    setShowSuggestions(false);
  }

  async function resolveAuthorId(): Promise<string> {
    if (authorId) return authorId;

    // Exact match by name (case-insensitive)
    const match = authors.find(
      (a) => a.name.toLowerCase() === authorInput.trim().toLowerCase()
    );
    if (match) return match.id;

    // Create new author
    await createAuthor(authorInput.trim());
    const updated = await getAuthors();
    const created = updated.find(
      (a) => a.name.toLowerCase() === authorInput.trim().toLowerCase()
    );
    if (!created) throw new Error('Não foi possível criar o autor.');
    return created.id;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!form.isbn.trim() || !form.name.trim() || !authorInput.trim()) {
      setFeedback({ type: 'error', message: 'ISBN, Título e Autor são obrigatórios.' });
      return;
    }

    if (form.availableQuantity > form.totalQuantity) {
      setFeedback({ type: 'error', message: 'Quantidade disponível não pode ser maior que a total.' });
      return;
    }

    setIsLoading(true);
    try {
      const resolvedAuthorId = await resolveAuthorId();

      await createBook({
        isbn: form.isbn,
        name: form.name,
        authorId: resolvedAuthorId,
        categories: form.categories,
        description: form.description,
        year: form.year,
        totalQuantity: form.totalQuantity,
        availableQuantity: form.availableQuantity,
      });

      setFeedback({ type: 'success', message: 'Livro adicionado com sucesso!' });
      setTimeout(() => {
        dialogRef.current?.close();
        onSuccess?.();
      }, 1200);
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erro ao adicionar livro.',
      });
    } finally {
      setIsLoading(false);
    }
  }

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
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-(--text)/20">
          <h2 className="font-serif text-lg uppercase tracking-widest font-bold">
            Adicionar Novo Livro
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

        {/* Fields */}
        <div className="flex flex-col gap-4 px-5 py-5">
          {/* Cover preview */}
          <div className="flex justify-center">
            <div
              className="w-28 h-40 border border-(--text)/30 flex items-center justify-center overflow-hidden shrink-0"
              style={{ background: 'var(--foreground)' }}
            >
              {coverUrl && !coverError ? (
                <Image
                  key={coverUrl}
                  src={coverUrl}
                  alt="Capa do livro"
                  width={112}
                  height={160}
                  className="object-cover w-full h-full"
                  onError={() => setCoverError(true)}
                  unoptimized
                />
              ) : (
                <span className="font-sans text-[10px] text-(--text)/40 text-center px-2">
                  {form.isbn.replace(/-/g, '').trim().length >= 10
                    ? 'Capa não encontrada'
                    : 'Digite o ISBN'}
                </span>
              )}
            </div>
          </div>

          {/* ISBN */}
          <div className="flex flex-col gap-1">
            <label className="font-serif text-xs uppercase tracking-widest text-(--text)/70">
              ISBN
            </label>
            <input
              id="modal-isbn"
              name="isbn"
              type="text"
              value={form.isbn}
              onChange={handleChange}
              placeholder="Ex.: 978-0-7653-2843-4"
              className="form-input"
              autoFocus
            />
          </div>

          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="font-serif text-xs uppercase tracking-widest text-(--text)/70">
              Nome:
            </label>
            <input
              id="modal-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="The Sudden Stop"
              className="form-input"
            />
          </div>

          {/* Autor (autocomplete) */}
          <div className="flex flex-col gap-1 relative">
            <label className="font-serif text-xs uppercase tracking-widest text-(--text)/70">
              Autor:
            </label>
            <input
              id="modal-author"
              type="text"
              value={authorInput}
              onChange={(e) => {
                setAuthorInput(e.target.value);
                setAuthorId('');
                setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Rick Burroughs"
              className="form-input"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-50 border border-(--text)/30 bg-(--background) max-h-40 overflow-y-auto mt-1">
                {suggestions.map((a) => (
                  <li
                    key={a.id}
                    onMouseDown={() => handleAuthorSelect(a)}
                    className="px-3 py-2 font-sans text-sm cursor-pointer hover:bg-(--button-active) hover:text-(--button-text-active) transition-colors"
                  >
                    {a.name}
                  </li>
                ))}
              </ul>
            )}
            {authorInput.length >= 2 && !authorId && suggestions.length === 0 && (
              <p className="font-sans text-xs text-(--text)/50 mt-1">
                Autor não encontrado — será criado ao salvar.
              </p>
            )}
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-1">
            <label className="font-serif text-xs uppercase tracking-widest text-(--text)/70">
              Categoria
            </label>
            <input
              id="modal-categories"
              name="categories"
              type="text"
              value={form.categories}
              onChange={handleChange}
              placeholder="Suspense, Terror"
              className="form-input"
            />
          </div>

          {/* Descrição */}
          <div className="flex flex-col gap-1">
            <label className="font-serif text-xs uppercase tracking-widest text-(--text)/70">
              Descrição
            </label>
            <textarea
              id="modal-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Uma breve descrição do livro…"
              className="form-input resize-none"
            />
          </div>

          {/* Ano + Qtd Total + Qtd Disponível */}
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="font-serif text-xs uppercase tracking-widest text-(--text)/70">
                Ano Publicado
              </label>
              <input
                id="modal-year"
                name="year"
                type="number"
                min={1000}
                max={new Date().getFullYear()}
                value={form.year}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="font-serif text-xs uppercase tracking-widest text-(--text)/70">
                Total
              </label>
              <input
                id="modal-total-qty"
                name="totalQuantity"
                type="number"
                min={1}
                value={form.totalQuantity}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="font-serif text-xs uppercase tracking-widest text-(--text)/70">
                Disponível
              </label>
              <input
                id="modal-available-qty"
                name="availableQuantity"
                type="number"
                min={0}
                max={form.totalQuantity}
                value={form.availableQuantity}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <p
              className={`font-sans text-sm text-center font-medium ${feedback.type === 'success'
                ? 'text-(--status-success)'
                : 'text-(--status-error)'
                }`}
            >
              {feedback.message}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5">
          <ActionButton
            type="submit"
            title={isLoading ? 'Adicionando…' : 'Adicionar'}
            variant="fill"
            disabled={isLoading}
            className="w-full text-base py-3"
          />
        </div>
      </form>
    </dialog>
  );
}
