import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { AddBookModal } from '@/components/Form/AddBookModal';
import { initialBookForm } from '@/types/formTypes';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockAddNewBook = jest.fn();
const mockUpdateBook = jest.fn();

jest.mock('@/services/Book', () => ({
  addNewBook: (...args: any[]) => mockAddNewBook(...args),
  updateBook: (...args: any[]) => mockUpdateBook(...args),
}));

const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
const mockClose = jest.fn();

jest.mock('@/hooks/useAlertModal', () => ({
  useAlertModal: () => ({
    modal: { visible: false, type: 'success', title: '', description: '' },
    close: mockClose,
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockOnClose = jest.fn();
const mockOnSuccess = jest.fn();

const defaultProps = {
  open: true,
  onClose: mockOnClose,
  onSuccess: mockOnSuccess,
};

function renderModal(props = {}) {
  return render(<AddBookModal {...defaultProps} {...props} />);
}

// ─── Testes ──────────────────────────────────────────────────────────────────

describe('AddBookModal (Mobile) — Criação de Livros', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  test('Renderiza o modal quando open=true', () => {
    const { getByText, getByPlaceholderText } = renderModal({ open: true });

    expect(getByText('Adicionar Novo Livro')).toBeTruthy();
    expect(getByPlaceholderText('9780553802023')).toBeTruthy();
    expect(getByPlaceholderText('Universo numa casca de noz')).toBeTruthy();
    expect(getByPlaceholderText('Stephen Hawking')).toBeTruthy();
    expect(getByPlaceholderText('2001')).toBeTruthy();
    expect(getByPlaceholderText('Estudos, Física')).toBeTruthy();
    expect(getByPlaceholderText('Uma breve descrição do livro...')).toBeTruthy();

    expect(getByText('Adicionar')).toBeTruthy();
  });

  test('Não renderiza o modal quando open=false', () => {
    const { queryByText, queryByPlaceholderText } = renderModal({ open: false });

    expect(queryByText('Adicionar Novo Livro')).toBeNull();
    expect(queryByPlaceholderText('9780553802023')).toBeNull();
  });

  test('Atualiza o valor dos campos ao digitar', () => {
    const { getByPlaceholderText } = renderModal();

    const nameInput = getByPlaceholderText('Universo numa casca de noz');
    fireEvent.changeText(nameInput, 'Dom Casmurro');
    expect(nameInput.props.value).toBe('Dom Casmurro');

    const isbnInput = getByPlaceholderText('9780553802023');
    fireEvent.changeText(isbnInput, '9788585326182');
    expect(isbnInput.props.value).toBe('9788585326182');
  });

  test('Submit chama addNewBook com os dados do formulário', async () => {
    mockAddNewBook.mockResolvedValueOnce({ id: 'abc', name: 'Fundação' });
    const { getByPlaceholderText, getByText } = renderModal();

    fireEvent.changeText(getByPlaceholderText('9780553802023'), '9780553802023');
    fireEvent.changeText(getByPlaceholderText('Universo numa casca de noz'), 'Fundação');
    fireEvent.changeText(getByPlaceholderText('Stephen Hawking'), 'Isaac Asimov');
    fireEvent.changeText(getByPlaceholderText('2001'), '1951');
    fireEvent.changeText(getByPlaceholderText('Estudos, Física'), 'ficção científica');
    fireEvent.changeText(getByPlaceholderText('Uma breve descrição do livro...'), 'Clássico da ficção científica.');

    act(() => {
      jest.advanceTimersByTime(600);
    });
    fireEvent.press(getByText('Adicionar'));

    await waitFor(() => {
      expect(mockAddNewBook).toHaveBeenCalledTimes(1);
    });

    const callArg = mockAddNewBook.mock.calls[0][0];
    expect(callArg).toMatchObject({
      isbn: '9780553802023',
      name: 'Fundação',
      author: { name: 'Isaac Asimov' },
      year: 1951,
      categories: 'ficção científica',
      description: 'Clássico da ficção científica.',
    });
  });

  test('Sucesso na criação chama showSuccess', async () => {
    mockAddNewBook.mockResolvedValueOnce({ id: 'abc' });
    const { getByPlaceholderText, getByText } = renderModal();

    fireEvent.changeText(getByPlaceholderText('9780553802023'), '9780553802023');
    fireEvent.changeText(getByPlaceholderText('Universo numa casca de noz'), 'Livro Qualquer');
    fireEvent.changeText(getByPlaceholderText('Stephen Hawking'), 'Autor Teste');
    fireEvent.changeText(getByPlaceholderText('Estudos, Física'), 'ficção');
    fireEvent.changeText(getByPlaceholderText('Uma breve descrição do livro...'), 'Descrição de teste.');

    act(() => {
      jest.advanceTimersByTime(600);
    });

    fireEvent.press(getByText('Adicionar'));

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith('Sucesso!', 'Livro adicionado com sucesso!', expect.any(Function));
    });
  });

  test('Erro na criação chama showError com a mensagem da exceção', async () => {
    mockAddNewBook.mockRejectedValueOnce(new Error('ISBN já cadastrado.'));
    const { getByPlaceholderText, getByText } = renderModal();

    fireEvent.changeText(getByPlaceholderText('9780553802023'), '9780553802023');
    fireEvent.changeText(getByPlaceholderText('Universo numa casca de noz'), 'Livro com Erro');
    fireEvent.changeText(getByPlaceholderText('Stephen Hawking'), 'Autor Teste');
    fireEvent.changeText(getByPlaceholderText('Estudos, Física'), 'ficção');
    fireEvent.changeText(getByPlaceholderText('Uma breve descrição do livro...'), 'Descrição de teste.');

    act(() => {
      jest.advanceTimersByTime(600);
    });

    fireEvent.press(getByText('Adicionar'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Erro ao salvar livro', 'ISBN já cadastrado.');
    });
  });

  test('Modo edit: submit chama updateBook (não addNewBook)', async () => {
    mockUpdateBook.mockResolvedValueOnce({ id: 'existing-id' });

    const editData = {
      ...initialBookForm,
      id: 'existing-id',
      name: 'Livro Existente',
      isbn: '9780132350884',
      author: { name: 'Robert C. Martin' },
      year: 2008,
      categories: 'programação',
      description: 'Clean Code.',
      totalQuantity: 5,
      totalAvailable: 4,
    };

    const { getByText } = renderModal({ mode: 'edit', initialData: editData });

    act(() => {
      jest.advanceTimersByTime(600);
    });

    fireEvent.press(getByText('Atualizar'));

    await waitFor(() => {
      expect(mockUpdateBook).toHaveBeenCalledTimes(1);
      expect(mockAddNewBook).not.toHaveBeenCalled();
    });

    expect(mockUpdateBook.mock.calls[0][0]).toBe('existing-id');
  });

  test('Modo edit: o título do modal é "Atualizar Livro"', () => {
    const editData = { ...initialBookForm, id: 'some-id', name: 'Livro para Editar' };
    const { getByText, queryByText } = renderModal({ mode: 'edit', initialData: editData });

    expect(getByText('Atualizar Livro')).toBeTruthy();
    expect(queryByText('Adicionar Novo Livro')).toBeNull();
  });
});
