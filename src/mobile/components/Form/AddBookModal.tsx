import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';

import { AlertModal } from '@/components/Global/AlertModal';
import { ActionButton } from '@/components/Global/ActionButton';
import { BaseField, BaseInputModal } from './BaseInput';

import { addNewBook, updateBook } from '@/services/Book';
import { type BookForm, initialBookForm } from '@/types/formTypes';
import { useAlertModal } from '@/hooks/useAlertModal';
import { Colors } from '@/constants/Theme';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type AddBookModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode?: 'create' | 'edit';
  initialData?: BookForm;
};

// ─── Componente ───────────────────────────────────────────────────────────────

export function AddBookModal({
  open = false,
  onClose,
  onSuccess,
  mode = 'create',
  initialData = initialBookForm,
}: AddBookModalProps) {
  const { modal, close: closeAlert, showSuccess, showError } = useAlertModal();

  const [form, setForm] = useState<BookForm>(initialBookForm);
  const [submitting, setSubmitting] = useState(false);

  // Preview de capa via OpenLibrary (igual à versão web)
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverError, setCoverError] = useState(false);

  // ─── Sincroniza o formulário ao abrir o modal ──────────────────────────────

  useEffect(() => {
    if (!open) return;
    const data = mode === 'edit' && initialData ? { ...initialBookForm, ...initialData } : initialBookForm;
    setForm(data);
    setCoverUrl(data.imageSrc || null);
    setCoverError(false);
  }, [initialData, mode, open]);

  // ─── Preview de capa com debounce de 500ms ────────────────────────────────

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

  // ─── Helpers de formulário ────────────────────────────────────────────────

  function handleChange(field: keyof BookForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNumberChange(field: keyof BookForm, value: string) {
    const parsed = value === '' ? 0 : parseInt(value, 10);
    setForm((prev) => ({ ...prev, [field]: isNaN(parsed) ? 0 : parsed }));
  }

  // ─── Validação ────────────────────────────────────────────────────────────

  function validate(): string | null {
    if (!form.isbn.trim()) return 'ISBN é obrigatório.';
    if (!form.name.trim()) return 'Nome do livro é obrigatório.';
    if (!form.author.name.trim()) return 'Autor é obrigatório.';
    if (!form.year || Number(form.year) <= 0) return 'Ano de publicação é obrigatório e deve ser positivo.';
    if (!form.categories.trim()) return 'Pelo menos uma categoria é obrigatória.';
    if (!form.description.trim()) return 'Descrição é obrigatória.';
    if (!form.totalQuantity || form.totalQuantity <= 0) return 'Quantidade total deve ser maior que 0.';
    if (form.totalAvailable < 0) return 'Cópias disponíveis não pode ser negativo.';
    if (form.totalAvailable > form.totalQuantity)
      return 'Cópias disponíveis não pode ser maior que a quantidade total.';
    return null;
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit() {
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      showError('Campos inválidos', validationError);
      return;
    }

    setSubmitting(true);
    try {
      const clean = (form.isbn ?? '').replace(/-/g, '').trim();
      const finalCoverUrl =
        clean.length >= 10 ? `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false` : '';

      if (mode === 'edit') {
        await updateBook(form.id, form);
      } else {
        await addNewBook({ ...form, imageSrc: finalCoverUrl });
      }

      showSuccess(
        'Sucesso!',
        mode === 'edit' ? 'Livro atualizado com sucesso!' : 'Livro adicionado com sucesso!',
        () => {
          onSuccess?.();
          onClose();
        },
      );
    } catch (err: any) {
      showError('Erro ao salvar livro', err?.message ?? 'Erro desconhecido');
    } finally {
      setSubmitting(false);
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <BaseInputModal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Adicionar Novo Livro' : 'Atualizar Livro'}
    >
      {/* Preview de capa */}
      <View style={styles.coverWrapper}>
        <Image
          source={coverUrl && !coverError ? { uri: coverUrl } : require('@/assets/images/mock-book.png')}
          style={styles.coverImage}
          onError={() => setCoverError(true)}
          resizeMode="cover"
        />
      </View>

      {/* ISBN */}
      <BaseField label="ISBN">
        <TextInput
          value={form.isbn}
          onChangeText={(v) => handleChange('isbn', v)}
          placeholder="9780553802023"
          placeholderTextColor={Colors.fairground + '80'}
          keyboardType="numeric"
          maxLength={13}
          style={styles.textInput}
        />
      </BaseField>

      {/* Nome do Livro */}
      <BaseField label="Nome do Livro">
        <TextInput
          value={form.name}
          onChangeText={(v) => handleChange('name', v)}
          placeholder="Universo numa casca de noz"
          placeholderTextColor={Colors.fairground + '80'}
          style={styles.textInput}
        />
      </BaseField>

      {/* Autor */}
      <BaseField label="Autor">
        <TextInput
          value={form.author.name}
          onChangeText={(v) =>
            setForm((prev) => ({
              ...prev,
              author: {
                ...prev.author,
                name: v,
              },
            }))
          }
          placeholder="Stephen Hawking"
          placeholderTextColor={Colors.fairground + '80'}
          style={styles.textInput}
        />
      </BaseField>

      {/* Ano de Publicação */}
      <BaseField label="Ano de Publicação">
        <TextInput
          value={String(form.year)}
          onChangeText={(v) => handleNumberChange('year', v)}
          placeholder="2001"
          placeholderTextColor={Colors.fairground + '80'}
          keyboardType="numeric"
          maxLength={4}
          style={styles.textInput}
        />
      </BaseField>

      {/* Categorias */}
      <BaseField label="Categorias">
        <TextInput
          value={form.categories}
          onChangeText={(v) => handleChange('categories', v)}
          placeholder="Estudos, Física"
          placeholderTextColor={Colors.fairground + '80'}
          style={styles.textInput}
        />
      </BaseField>

      {/* Descrição */}
      <BaseField label="Descrição">
        <TextInput
          value={form.description}
          onChangeText={(v) => handleChange('description', v)}
          placeholder="Uma breve descrição do livro..."
          placeholderTextColor={Colors.fairground + '80'}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[styles.textInput, styles.textArea]}
        />
      </BaseField>

      {/* Quantidades */}
      <View style={styles.row}>
        <View style={styles.rowItem}>
          <BaseField label="Qtde. de Cópias">
            <TextInput
              value={String(form.totalQuantity)}
              onChangeText={(v) => handleNumberChange('totalQuantity', v)}
              keyboardType="numeric"
              style={[styles.textInput, styles.numberInput]}
            />
          </BaseField>
        </View>

        <View style={styles.rowItem}>
          <BaseField label="Disponíveis">
            <TextInput
              value={String(form.totalAvailable)}
              onChangeText={(v) => handleNumberChange('totalAvailable', v)}
              keyboardType="numeric"
              style={[styles.textInput, styles.numberInput]}
            />
          </BaseField>
        </View>
      </View>

      {/* Botão de submit */}
      <ActionButton
        title={submitting ? 'Aguarde...' : mode === 'create' ? 'Adicionar' : 'Atualizar'}
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

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  coverWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },

  coverImage: {
    width: 80,
    height: 112,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 4,
    backgroundColor: Colors.foreground,
  },

  textInput: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.text,
    borderRadius: 4,
    fontSize: 14,
    color: Colors.text,
    backgroundColor: Colors.foreground,
  },

  textArea: {
    minHeight: 90,
  },

  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },

  rowItem: {
    flex: 1,
  },

  numberInput: {
    textAlign: 'center',
  },

  submitButton: {
    height: 48,
    marginTop: 4,
  },
});
