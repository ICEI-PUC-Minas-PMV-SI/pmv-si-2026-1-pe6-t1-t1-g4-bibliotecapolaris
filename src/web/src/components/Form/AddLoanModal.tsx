'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { ActionButton } from '@/components';
import { BaseField, BaseInputModal } from './BaseInput';
import { getBooks } from '@/services/Books';
import { createLoan } from '@/services/Loans';
import { getStudents } from '@/services/User';
import { useAlertModal } from '@/hooks/useAlertModal';

type AddLoanModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

function localDateIso(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function AddLoanModal({ open, onClose, onSuccess }: AddLoanModalProps) {
  const { showSuccess, showError, ModalComponent } = useAlertModal();

  const [books, setBooks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [dueDateDisplay, setDueDateDisplay] = useState('');
  const [dueDateIso, setDueDateIso] = useState('');
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    setSelectedBookId('');
    setSelectedAuthor('');
    setSelectedStudentId('');
    setDueDateDisplay('');
    setDueDateIso('');
    setLoadingStudents(true);

    Promise.all([getBooks(), getStudents()])
      .then(([fetchedBooks, fetchedStudents]) => {
        setBooks(fetchedBooks ?? []);
        setStudents(fetchedStudents ?? []);
      })
      .catch(() => {
        setBooks([]);
        setStudents([]);
      })
      .finally(() => setLoadingStudents(false));
  }, [open]);

  const authors = useMemo(() => {
    const seen = new Map<string, any>();
    books.forEach((b) => {
      const a = b.author;
      if (!a) return;
      const id = a?.id ?? a;
      if (!seen.has(String(id))) seen.set(String(id), a);
    });
    return Array.from(seen.values()).sort((a, b) => {
      const na = a?.name ?? a;
      const nb = b?.name ?? b;
      return String(na).localeCompare(String(nb));
    });
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!selectedAuthor) return books;
    return books.filter((b) => {
      const id = b.author?.id ?? b.author;
      return String(id) === selectedAuthor;
    });
  }, [books, selectedAuthor]);

  function handleBookSelect(bookId: string) {
    setSelectedBookId(bookId);
    const book = books.find((b) => b.id === bookId);
    const a = book?.author;
    if (a) setSelectedAuthor(String(a?.id ?? a));
  }

  function handleAuthorSelect(authorId: string) {
    setSelectedAuthor(authorId);
    setSelectedBookId('');
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();

    if (!selectedStudentId) return showError('Erro', 'Selecione um estudante.');
    if (!selectedBookId) return showError('Erro', 'Selecione um livro.');

    try {
      await createLoan({
        bookId: selectedBookId,
        userId: selectedStudentId,
        loanDate: localDateIso(0),
        returnDate: dueDateIso || localDateIso(7),
      });

      showSuccess('Sucesso!', 'Empréstimo criado com sucesso!', () => {
        onSuccess?.();
        onClose();
      });
    } catch (err) {
      showError('Erro', err instanceof Error ? err.message : 'Erro ao criar empréstimo');
    }
  }

  return (
    <BaseInputModal open={open} onClose={onClose} title="Adicionar Novo Empréstimo">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <BaseField label="Nome">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="form-input"
          >
            <option value="">
              {loadingStudents ? 'Carregando estudantes...' : 'Selecione um estudante'}
            </option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </BaseField>

        <BaseField label="Nome do Livro">
          <select
            value={selectedBookId}
            onChange={(e) => handleBookSelect(e.target.value)}
            className="form-input"
          >
            <option value="">
              {filteredBooks.length === 0 ? 'Carregando livros...' : 'Selecione um livro'}
            </option>
            {filteredBooks.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
        </BaseField>

        <BaseField label="Nome do Autor">
          <select
            value={selectedAuthor}
            onChange={(e) => handleAuthorSelect(e.target.value)}
            className="form-input"
          >
            <option value="">Todos os autores</option>
            {authors.map((author) => {
              const id = String(author?.id ?? author);
              const name = author?.name ?? author;
              return (
                <option key={id} value={id}>
                  {name}
                </option>
              );
            })}
          </select>
        </BaseField>

        <BaseField label="Data de Entrega">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={dueDateDisplay}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
                let display = digits;
                if (digits.length > 4) display = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
                else if (digits.length > 2) display = digits.slice(0, 2) + '/' + digits.slice(2);
                setDueDateDisplay(display);
                if (digits.length === 8) {
                  setDueDateIso(`${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`);
                } else {
                  setDueDateIso('');
                }
              }}
              placeholder="Padrão: 7 dias depois de hoje"
              maxLength={10}
              className="form-input"
            />
            <input
              ref={datePickerRef}
              type="date"
              min={localDateIso(1)}
              className="sr-only"
              onChange={(e) => {
                const iso = e.target.value;
                if (!iso) return;
                const [y, m, d] = iso.split('-');
                setDueDateDisplay(`${d}/${m}/${y}`);
                setDueDateIso(iso);
              }}
            />
            <button
              type="button"
              onClick={() => datePickerRef.current?.showPicker()}
              className="form-input w-auto px-3 cursor-pointer shrink-0"
              title="Selecionar data"
            >
              📅
            </button>
          </div>
        </BaseField>

        <ActionButton
          title="Adicionar"
          type="submit"
          variant="fill"
          className="h-12 text-3xl rounded-sm"
        />
      </form>

      {ModalComponent}
    </BaseInputModal>
  );
}
