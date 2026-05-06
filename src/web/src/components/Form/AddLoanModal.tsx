'use client';

import { useEffect, useState } from 'react';

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
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [dueDate, setDueDate] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (!open) return;

    setSelectedBookId('');
    setStudentSearch('');
    setSelectedStudent(null);
    setDueDate('');

    Promise.all([getBooks(), getLoans()]).then(([fetchedBooks, fetchedLoans]) => {
      setBooks(fetchedBooks ?? []);

      const seen = new Map<string, any>();
      (fetchedLoans ?? []).forEach((l: any) => {
        if (l.student && !seen.has(l.student.id)) seen.set(l.student.id, l.student);
      });
      setStudents(Array.from(seen.values()));
    });
  }, [open]);

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
        returnDate: dueDate || todayPlus(7),
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

        <BaseField label="Livro">
          <div className="flex flex-col gap-2">
            {books.length === 0 && (
              <span className="form-input opacity-50">Carregando livros...</span>
            )}
            {books.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => setSelectedBookId(book.id)}
                className={`form-input text-left cursor-pointer transition-opacity ${
                  selectedBookId === book.id
                    ? 'ring-2 ring-(--button-active) opacity-100'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {book.name}
              </button>
            ))}
          </div>
        </BaseField>

        <BaseField label="Data de Entrega">
          <input
            type="date"
            value={dueDate}
            min={todayPlus(1)}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
          <span className="text-sm text-(--text)/60 font-sans">
            Padrão: 7 dias depois de hoje
          </span>
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
