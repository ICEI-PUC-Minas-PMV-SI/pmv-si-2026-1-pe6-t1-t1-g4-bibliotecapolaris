/**
 * Testes Unitários — AddBookModal
 *
 * O componente é testado de forma isolada do backend e do Next.js.
 * As dependências externas são mockadas:
 *   - @/services/Books      → addNewBook, updateBook
 *   - @/hooks/useAlertModal → showSuccess, showError
 *   - next/image            → <img> simples para o jsdom
 *
 * Nota sobre seletores:
 *   - O componente usa BaseField com <label> sem htmlFor, portanto
 *     usamos getByPlaceholderText() em vez de getByLabelText() para
 *     localizar os inputs de forma confiável.
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { AddBookModal } from '@/components/Form/AddBookModal';
import { initialBookForm } from '@/types/formTypes';

// ─── Mocks ───────────────────────────────────────────────────────────────────

// AddBookModal importa @/components barrel que puxa WithdrawButton → @/services/Loans → @/lib/api
jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

// next/image não funciona no jsdom — substituímos por um <img> simples
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock dos serviços de livros
const mockAddNewBook = jest.fn();
const mockUpdateBook = jest.fn();

jest.mock('@/services/Books', () => ({
  addNewBook: (...args: unknown[]) => mockAddNewBook(...args),
  updateBook: (...args: unknown[]) => mockUpdateBook(...args),
}));

// Mock do hook useAlertModal para capturar as chamadas de showSuccess/showError
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

jest.mock('@/hooks/useAlertModal', () => ({
  useAlertModal: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    ModalComponent: null,
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

describe('AddBookModal — Criação de Livros', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ── RTL-01 ──────────────────────────────────────────────────────────────
  test('RTL-01 · Renderiza o modal quando open=true', () => {
    renderModal({ open: true });

    // Título do modal
    expect(screen.getByText('Adicionar um novo livro')).toBeInTheDocument();

    // Campos do formulário via placeholder (BaseField não usa htmlFor)
    expect(screen.getByPlaceholderText('9780553802023')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Universo em numa casca de noz')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Stephen Hawking')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('2001')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Estudos, Física')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Lorem ipsum/)).toBeInTheDocument();

    // Botão de submit
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument();
  });

  // ── RTL-02 ──────────────────────────────────────────────────────────────
  test('RTL-02 · Não renderiza o modal quando open=false', () => {
    renderModal({ open: false });

    expect(screen.queryByText('Adicionar um novo livro')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('9780553802023')).not.toBeInTheDocument();
  });

  // ── RTL-03 ──────────────────────────────────────────────────────────────
  test('RTL-03 · Atualiza o valor dos campos ao digitar', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderModal();

    const nameInput = screen.getByPlaceholderText('Universo em numa casca de noz');
    await user.clear(nameInput);
    await user.type(nameInput, 'Dom Casmurro');
    expect(nameInput).toHaveValue('Dom Casmurro');

    const isbnInput = screen.getByPlaceholderText('9780553802023');
    await user.clear(isbnInput);
    await user.type(isbnInput, '9788585326182');
    expect(isbnInput).toHaveValue('9788585326182');
  });

  // ── RTL-04 ──────────────────────────────────────────────────────────────
  test('RTL-04 · Submit chama addNewBook com os dados do formulário', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockAddNewBook.mockResolvedValueOnce({ id: 'abc', name: 'Fundação' });
    renderModal();

    // Preenche os campos usando placeholders
    await user.type(screen.getByPlaceholderText('9780553802023'), '9780553802023');
    await user.type(screen.getByPlaceholderText('Universo em numa casca de noz'), 'Fundação');
    await user.type(screen.getByPlaceholderText('Stephen Hawking'), 'Isaac Asimov');
    await user.clear(screen.getByPlaceholderText('2001'));
    await user.type(screen.getByPlaceholderText('2001'), '1951');
    await user.type(screen.getByPlaceholderText('Estudos, Física'), 'ficção científica');
    await user.type(
      screen.getByPlaceholderText(/Lorem ipsum/),
      'Clássico da ficção científica.',
    );

    // Avança o timer do debounce de ISBN (500ms)
    act(() => {
      jest.advanceTimersByTime(600);
    });

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockAddNewBook).toHaveBeenCalledTimes(1);
    });

    const callArg = mockAddNewBook.mock.calls[0][0];
    expect(callArg).toMatchObject({
      isbn: '9780553802023',
      name: 'Fundação',
      author: 'Isaac Asimov',
      year: 1951,
      categories: 'ficção científica',
      description: 'Clássico da ficção científica.',
    });
  });

  // ── RTL-05 ──────────────────────────────────────────────────────────────
  test('RTL-05 · Sucesso na criação chama showSuccess', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockAddNewBook.mockResolvedValueOnce({ id: 'abc' });
    renderModal();

    // Todos os campos obrigatórios devem ser preenchidos para a validação passar
    await user.type(screen.getByPlaceholderText('9780553802023'), '9780553802023');
    await user.type(screen.getByPlaceholderText('Universo em numa casca de noz'), 'Livro Qualquer');
    await user.type(screen.getByPlaceholderText('Stephen Hawking'), 'Autor Teste');
    await user.type(screen.getByPlaceholderText('Estudos, Física'), 'ficção');
    await user.type(screen.getByPlaceholderText(/Lorem ipsum/), 'Descrição de teste.');

    act(() => jest.advanceTimersByTime(600));

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Sucesso!',
        'Livro adicionado com sucesso!',
        expect.any(Function),
      );
    });
  });

  // ── RTL-06 ──────────────────────────────────────────────────────────────
  test('RTL-06 · Erro na criação chama showError com a mensagem da exceção', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockAddNewBook.mockRejectedValueOnce(new Error('ISBN já cadastrado.'));
    renderModal();

    await user.type(screen.getByPlaceholderText('9780553802023'), '9780553802023');
    await user.type(screen.getByPlaceholderText('Universo em numa casca de noz'), 'Livro com Erro');
    await user.type(screen.getByPlaceholderText('Stephen Hawking'), 'Autor Teste');
    await user.type(screen.getByPlaceholderText('Estudos, Física'), 'ficção');
    await user.type(screen.getByPlaceholderText(/Lorem ipsum/), 'Descrição de teste.');

    act(() => jest.advanceTimersByTime(600));

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Erro ao salvar livro', 'ISBN já cadastrado.');
    });
  });

  // ── RTL-07 ──────────────────────────────────────────────────────────────
  test('RTL-07 · Erro genérico exibe mensagem de string quando a exceção não é Error', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    // Rejeita com algo que não é instanceof Error — deve usar String(err)
    mockAddNewBook.mockRejectedValueOnce('erro desconhecido');
    renderModal();

    await user.type(screen.getByPlaceholderText('9780553802023'), '9780553802023');
    await user.type(screen.getByPlaceholderText('Universo em numa casca de noz'), 'Livro');
    await user.type(screen.getByPlaceholderText('Stephen Hawking'), 'Autor Teste');
    await user.type(screen.getByPlaceholderText('Estudos, Física'), 'ficção');
    await user.type(screen.getByPlaceholderText(/Lorem ipsum/), 'Descrição de teste.');

    act(() => jest.advanceTimersByTime(600));

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Erro ao salvar livro', 'erro desconhecido');
    });
  });

  // ── RTL-08 ──────────────────────────────────────────────────────────────
  test('RTL-08 · Modo edit: submit chama updateBook (não addNewBook)', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUpdateBook.mockResolvedValueOnce({ id: 'existing-id' });

    const editData = {
      ...initialBookForm,
      id: 'existing-id',
      name: 'Livro Existente',
      isbn: '9780132350884',
      author: 'Robert C. Martin',
      year: 2008,
      categories: 'programação',
      description: 'Clean Code.',
      totalQuantity: 5,
      totalAvailable: 4,
    };

    renderModal({ mode: 'edit', initialData: editData });

    act(() => jest.advanceTimersByTime(600));

    // No modo edit o botão se chama "Atualizar"
    await user.click(screen.getByRole('button', { name: 'Atualizar' }));

    await waitFor(() => {
      expect(mockUpdateBook).toHaveBeenCalledTimes(1);
      expect(mockAddNewBook).not.toHaveBeenCalled();
    });

    // Verifica que o id correto foi passado
    expect(mockUpdateBook.mock.calls[0][0]).toBe('existing-id');
  });

  // ── RTL-09 ──────────────────────────────────────────────────────────────
  test('RTL-09 · Modo edit: o título do modal é "Atualizar livro"', () => {
    const editData = { ...initialBookForm, id: 'some-id', name: 'Livro para Editar' };
    renderModal({ mode: 'edit', initialData: editData });

    expect(screen.getByText('Atualizar livro')).toBeInTheDocument();
    expect(screen.queryByText('Adicionar um novo livro')).not.toBeInTheDocument();
  });
});
