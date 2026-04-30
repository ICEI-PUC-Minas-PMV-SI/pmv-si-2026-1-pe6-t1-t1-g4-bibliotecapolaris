'use client';

import { useState, useEffect } from 'react';
import { FormModal, FormField, BookCoverPreview } from '@/components';
import { createBook } from '@/services/Books';
import { createAuthor, getAuthors } from '@/services/Authors';
import type { Author } from '@/types';

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

export function AddBookModal({ onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);

  const [authorInfo, setAuthorInfo] = useState({ name: '', id: '' });
  const [form, setForm] = useState({
    isbn: '', name: '', categories: '', description: '',
    year: new Date().getFullYear(), totalQuantity: 1, availableQuantity: 1,
  });

  useEffect(() => {
    getAuthors().then(setAuthors).catch(() => { });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      const numValue = Number(value);
      if (numValue < 0) return;
      if (name === 'year' && value.length > 4) return;
      setForm(prev => ({ ...prev, [name]: numValue }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  async function resolveAuthorId(): Promise<string> {
    if (authorInfo.id) return authorInfo.id;
    
    const trimmedName = authorInfo.name.trim();
    const match = authors.find(a => a.name.toLowerCase() === trimmedName.toLowerCase());
    if (match) return match.id;

    const newAuthor = await createAuthor(trimmedName);
    return newAuthor.id;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);

    if (!form.isbn.trim() || !form.name.trim() || !authorInfo.name.trim()) {
      return setFeedback({ type: 'error', message: 'ISBN, Título e Autor são obrigatórios.' });
    }

    setIsLoading(true);
    try {
      const authorId = await resolveAuthorId();
      await createBook({ ...form, authorId });
      setFeedback({ type: 'success', message: 'Livro adicionado com sucesso!' });
      setTimeout(() => onSuccess?.(), 1200);
    } catch (err: unknown) {
      setFeedback({ type: 'error', message: err instanceof Error ? err.message : 'Erro ao adicionar livro.' });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <FormModal
      title="Adicionar Novo Livro"
      submitLabel={isLoading ? 'Adicionando…' : 'Adicionar'}
      isLoading={isLoading}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <BookCoverPreview isbn={form.isbn} />

      <FormField label="ISBN" id="isbn"><input name="isbn" value={form.isbn} onChange={handleChange} className="form-input" placeholder="Ex: 978-0123456789" autoFocus /></FormField>
      <FormField label="Nome" id="name"><input name="name" value={form.name} onChange={handleChange} className="form-input" placeholder="Título do livro" /></FormField>
      
      <FormField label="Autor" id="author">
        <AuthorInputInline 
          value={authorInfo.name} 
          authors={authors}
          onChange={(name, id) => setAuthorInfo({ name, id })} 
        />
      </FormField>

      <FormField label="Categoria" id="categories"><input name="categories" value={form.categories} onChange={handleChange} className="form-input" placeholder="Ex: Suspense, Fantasia" /></FormField>
      <FormField label="Descrição" id="description"><textarea name="description" value={form.description} onChange={handleChange} rows={3} className="form-input resize-none" placeholder="Breve resumo da obra..." /></FormField>

      <div className="flex gap-3">
        <FormField label="Ano" id="year" className="flex-1"><input name="year" type="number" value={form.year} onChange={handleChange} className="form-input" placeholder="AAAA" min={0} max={new Date().getFullYear() + 1} /></FormField>
        <FormField label="Total" id="total" className="flex-1"><input name="totalQuantity" type="number" value={form.totalQuantity} onChange={handleChange} className="form-input" placeholder="0" min={1} /></FormField>
        <FormField label="Disponível" id="available" className="flex-1"><input name="availableQuantity" type="number" value={form.availableQuantity} onChange={handleChange} className="form-input" placeholder="0" min={0} max={form.totalQuantity} /></FormField>
      </div>

      {feedback && (
        <p className={`text-sm text-center font-medium ${feedback.type === 'success' ? 'text-(--status-success)' : 'text-(--status-error)'}`}>
          {feedback.message}
        </p>
      )}
    </FormModal>
  );
}

// Componente Local para evitar poluir o AddBookModal
function AuthorInputInline({ value, authors, onChange }: { value: string, authors: Author[], onChange: (name: string, id: string) => void }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = value.length >= 2
    ? authors.filter((a) => a.name.toLowerCase().includes(value.toLowerCase()))
    : [];

  const selectedAuthor = authors.find(a => a.name.toLowerCase() === value.toLowerCase());

  return (
    <div className="relative">
      <input
        id="modal-author"
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value, '');
          setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder="Rick Burroughs"
        className="form-input"
        autoComplete="off"
      />

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 border border-(--text)/30 bg-(--background) max-h-40 overflow-y-auto mt-1 shadow-lg">
          {suggestions.map((a) => (
            <li
              key={a.id}
              onMouseDown={() => {
                onChange(a.name, a.id);
                setShowSuggestions(false);
              }}
              className="px-3 py-2 font-sans text-sm cursor-pointer hover:bg-(--button-active) hover:text-(--button-text-active) transition-colors"
            >
              {a.name}
            </li>
          ))}
        </ul>
      )}

      {value.length >= 2 && !selectedAuthor && suggestions.length === 0 && (
        <p className="font-sans text-xs text-(--text)/50 mt-1">
          Autor não encontrado — será criado ao salvar.
        </p>
      )}
    </div>
  );
}

