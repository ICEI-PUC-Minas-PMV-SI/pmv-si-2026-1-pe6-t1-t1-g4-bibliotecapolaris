'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { ActionButton } from '@/components';
import { BaseField, BaseInputModal } from './BaseInput';
import { getBooks } from '@/services/Books';
import { getLoans, createLoan } from '@/services/Loans';
import { useAlertModal } from '@/hooks/useAlertModal';

type AddLoanModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

function todayPlus(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function AddLoanModal({ open, onClose, onSuccess }: AddLoanModalProps) {
  const { showSuccess, showError, ModalComponent } = useAlertModal();

  const [books, setBooks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [dueDateDisplay, setDueDateDisplay] = useState('');
  const [dueDateIso, setDueDateIso] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    setSelectedBookId('');
    setSelectedAuthor('');
    setStudentSearch('');
    setSelectedStudent(null);
    setDueDateDisplay('');
    setDueDateIso('');

    Promise.all([getBooks(), getLoans()]).then(([fetchedBooks, fetchedLoans]) => {
      setBooks(fetchedBooks ?? []);

      const seen = new Map<string, any>();
      (fetchedLoans ?? []).forEach((l: any) => {
        if (l.student && !seen.has(l.student.id)) seen.set(l.student.id, l.student);
      });
      setStudents(Array.from(seen.values()));
    });
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

  const suggestions = studentSearch
    ? students.filter((s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()))
    : students;

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();

    if (!selectedStudent) return showError('Erro', 'Selecione um estudante válido.');
    if (!selectedBookId) return showError('Erro', 'Selecione um livro.');

    try {
      await createLoan({
        bookId: selectedBookId,
        userId: selectedStudent.id,
        loanDate: todayPlus(0),
        returnDate: dueDateIso || todayPlus(7),
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
          <div className="relative">
            <input
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value);
                setSelectedStudent(null);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="John Doe"
              className="form-input"
              autoComplete="off"
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full border border-(--text) bg-(--text) text-(--background) max-h-36 overflow-y-auto rounded-sm shadow-lg">
                {suggestions.map((s) => (
                  <li
                    key={s.id}
                    onMouseDown={() => {
                      setSelectedStudent(s);
                      setStudentSearch(s.name);
                      setShowSuggestions(false);
                    }}
                    className="px-4 py-2 cursor-pointer hover:opacity-70 font-sans font-medium"
                  >
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
              min={todayPlus(1)}
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
