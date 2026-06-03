import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { AlertModal } from '@/components/Global/AlertModal';
import { ActionButton } from '@/components/Global/ActionButton';
import { BaseField, BaseInputModal, SelectInput } from './BaseInput';

import { getBooks } from '@/services/Book';
import { createLoan } from '@/services/Loans';
import { getStudents } from '@/services/User';
import { useAlertModal } from '@/hooks/useAlertModal';

import { Colors } from '@/constants/Theme';

function localDateIso(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

type AddLoanModalProps = {
  role: 'administrator' | 'student';
  /** Pré-selecionado no fluxo do estudante (vem do BookDisplay) */
  bookId?: string;
  bookName?: string;
  /** ID do usuário logado — obrigatório no fluxo do estudante */
  userId?: string;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function AddLoanModal({
  role,
  bookId: initialBookId,
  bookName,
  userId,
  open,
  onClose,
  onSuccess,
}: AddLoanModalProps) {
  const isAdmin = role === 'administrator';

  const { modal, close: closeAlert, showSuccess, showError } = useAlertModal();

  const [books, setBooks] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Admin fields
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [dueDateDisplay, setDueDateDisplay] = useState('');
  const [dueDateIso, setDueDateIso] = useState('');

  // Student field
  const [duration, setDuration] = useState<7 | 14>(7);

  useEffect(() => {
    if (!open) return;

    setSelectedBookId('');
    setSelectedAuthor('');
    setSelectedStudentId('');
    setDueDateDisplay('');
    setDueDateIso('');
    setDuration(7);

    if (!isAdmin) return;

    setLoading(true);
    Promise.all([getBooks(), getStudents()])
      .then(([fetchedBooks, fetchedStudents]) => {
        setBooks(fetchedBooks ?? []);
        setStudents(fetchedStudents ?? []);
      })
      .catch(() => {
        setBooks([]);
        setStudents([]);
      })
      .finally(() => setLoading(false));
  }, [open, isAdmin]);

  const authors = useMemo(() => {
    const seen = new Map<string, any>();
    books.forEach((b) => {
      const a = b.author;
      if (!a) return;
      const id = String(a?.id ?? a);
      if (!seen.has(id)) seen.set(id, a);
    });
    return Array.from(seen.values()).sort((a, b) => String(a?.name ?? a).localeCompare(String(b?.name ?? b)));
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!selectedAuthor) return books;
    return books.filter((b) => String(b.author?.id ?? b.author) === selectedAuthor);
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

  function handleDateInput(text: string) {
    const digits = text.replace(/\D/g, '').slice(0, 8);
    let display = digits;
    if (digits.length > 4) display = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) display = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDueDateDisplay(display);
    if (digits.length === 8) {
      setDueDateIso(`${digits.slice(4)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`);
    } else {
      setDueDateIso('');
    }
  }

  async function handleSubmit() {
    if (submitting) return;
    setSubmitting(true);

    try {
      if (isAdmin) {
        if (!selectedStudentId) {
          showError('Erro', 'Selecione um estudante.');
          return;
        }
        if (!selectedBookId) {
          showError('Erro', 'Selecione um livro.');
          return;
        }

        await createLoan(
          {
            bookId: selectedBookId,
            userId: selectedStudentId,
            loanDate: localDateIso(0),
            returnDate: dueDateIso || localDateIso(7),
          },
          'admin',
        );
      } else {
        if (!initialBookId || !userId) {
          showError('Erro', 'Dados do empréstimo inválidos.');
          return;
        }

        await createLoan(
          {
            bookId: initialBookId,
            userId,
            loanDate: localDateIso(0),
            returnDate: localDateIso(duration),
          },
          'student',
        );
      }

      showSuccess('Sucesso!', isAdmin ? 'Empréstimo criado com sucesso!' : 'Solicitação enviada com sucesso!', () => {
        onSuccess?.();
        onClose();
      });
    } catch (err: any) {
      showError('Erro', err?.message ?? 'Erro ao criar empréstimo');
    } finally {
      setSubmitting(false);
    }
  }

  const studentOptions = students.map((s) => ({ value: s.id, label: s.name }));
  const authorOptions = [
    { value: '', label: 'Todos os autores' },
    ...authors.map((a) => ({ value: String(a?.id ?? a), label: String(a?.name ?? a) })),
  ];
  const bookOptions = filteredBooks.map((b) => ({ value: b.id, label: b.name }));

  return (
    <BaseInputModal open={open} onClose={onClose} title="Adicionar Novo Empréstimo">
      {isAdmin ? (
        <View>
          <BaseField label="Estudante">
            <SelectInput
              value={selectedStudentId}
              onChange={setSelectedStudentId}
              options={studentOptions}
              placeholder="Selecione um estudante"
              loading={loading}
            />
          </BaseField>

          <BaseField label="Autor">
            <SelectInput
              value={selectedAuthor}
              onChange={handleAuthorSelect}
              options={authorOptions}
              placeholder="Filtrar por autor"
              loading={loading}
            />
          </BaseField>

          <BaseField label="Livro">
            <SelectInput
              value={selectedBookId}
              onChange={handleBookSelect}
              options={bookOptions}
              placeholder="Selecione um livro"
              loading={loading}
            />
          </BaseField>

          <BaseField label="Data de Devolução">
            <TextInput
              value={dueDateDisplay}
              onChangeText={handleDateInput}
              placeholder="Padrão: 7 dias  (dd/mm/aaaa)"
              keyboardType="numeric"
              maxLength={10}
              style={styles.textInput}
            />
          </BaseField>
        </View>
      ) : (
        <>
          <BaseField label="Livro">
            <View style={styles.readOnly}>
              <Text style={styles.readOnlyText} numberOfLines={1}>
                {bookName ?? 'Livro selecionado'}
              </Text>
            </View>
          </BaseField>

          <BaseField label="Prazo">
            <View style={styles.durationRow}>
              {([7, 14] as const).map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.durationChip, duration === d && styles.durationChipActive]}
                  onPress={() => setDuration(d)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.durationText, duration === d && styles.durationTextActive]}>{d} dias</Text>
                </TouchableOpacity>
              ))}
            </View>
          </BaseField>
        </>
      )}

      <ActionButton
        title={submitting ? 'Aguarde...' : isAdmin ? 'Adicionar' : 'Solicitar'}
        variant="fill"
        disabled={submitting}
        onPress={handleSubmit}
        style={styles.submitButton}
      />

      <AlertModal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onClose={closeAlert}
        onSuccess={() => {
          closeAlert();
          modal.onSuccess?.();
        }}
      />
    </BaseInputModal>
  );
}

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 4,
    fontSize: 14,
    color: Colors.background,
    backgroundColor: Colors.fairground,
  },

  readOnly: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 4,
    backgroundColor: Colors.fairground,
  },

  readOnlyText: {
    fontSize: 14,
    color: Colors.background,
  },

  durationRow: {
    flexDirection: 'row',
    gap: 10,
  },

  durationChip: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 4,
    alignItems: 'center',
    backgroundColor: Colors.fairground,
  },

  durationChipActive: {
    backgroundColor: Colors.buttonActive,
    borderColor: Colors.buttonActive,
  },

  durationText: {
    fontSize: 14,
    color: Colors.background,
  },

  durationTextActive: {
    color: Colors.buttonTextActive,
    fontWeight: '600',
  },

  submitButton: {
    height: 48,
  },
});
