/**
 * Testes Unitários — AddLoanModal
 *
 * O componente é testado de forma isolada do backend e do Next.js.
 * Dependências mockadas:
 *   - @/services/Loans   → createLoan
 *   - @/services/Books   → getBooks
 *   - @/services/User    → getStudents
 *   - @/hooks/useAlertModal → showSuccess, showError
 *   - next/image         → <img> simples para o jsdom
 *
 * Nota sobre seletores:
 *   - BaseField usa <label> sem htmlFor, portanto selects são localizados
 *     via getAllByRole('combobox'): índice 0 = estudante, 1 = livro, 2 = autor.
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { AddLoanModal } from '@/components/Form/AddLoanModal';

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockCreateLoan = jest.fn();
jest.mock('@/services/Loans', () => ({
  createLoan: (...args: unknown[]) => mockCreateLoan(...args),
}));

const mockGetBooks = jest.fn();
jest.mock('@/services/Books', () => ({
  getBooks: (...args: unknown[]) => mockGetBooks(...args),
  addNewBook: jest.fn(),
  updateBook: jest.fn(),
}));

const mockGetStudents = jest.fn();
jest.mock('@/services/User', () => ({
  getStudents: (...args: unknown[]) => mockGetStudents(...args),
}));

const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();
jest.mock('@/hooks/useAlertModal', () => ({
  useAlertModal: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
    ModalComponent: null,
  }),
}));

// ─── Dados de Teste ──────────────────────────────────────────────────────────

const MOCK_STUDENTS = [
  { id: 'stu-1', name: 'Ana Silva' },
  { id: 'stu-2', name: 'Bruno Lima' },
];

const MOCK_BOOKS = [
  { id: 'bk-1', name: 'Fundação', author: { id: 'auth-1', name: 'Isaac Asimov' } },
  { id: 'bk-2', name: 'Dom Casmurro', author: { id: 'auth-2', name: 'Machado de Assis' } },
  { id: 'bk-3', name: 'Robôs e Império', author: { id: 'auth-1', name: 'Isaac Asimov' } },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const mockOnClose = jest.fn();
const mockOnSuccess = jest.fn();

function renderModal(props: Record<string, unknown> = {}) {
  return render(
    <AddLoanModal open={true} onClose={mockOnClose} onSuccess={mockOnSuccess} {...props} />,
  );
}

// ─── Testes ──────────────────────────────────────────────────────────────────

describe('AddLoanModal — Criação de Empréstimos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBooks.mockResolvedValue(MOCK_BOOKS);
    mockGetStudents.mockResolvedValue(MOCK_STUDENTS);
  });

  // ── LM-01 ──────────────────────────────────────────────────────────────
  test('LM-01 · Renderiza o modal quando open=true', () => {
    renderModal();

    expect(screen.getByText('Adicionar Novo Empréstimo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adicionar' })).toBeInTheDocument();
  });

  // ── LM-02 ──────────────────────────────────────────────────────────────
  test('LM-02 · Não carrega dados quando open=false', async () => {
    // AddLoanModal não tem guard de render, mas o useEffect ignora open=false
    renderModal({ open: false });

    // Aguarda um tick para garantir que nenhum efeito assíncrono foi disparado
    await new Promise((r) => setTimeout(r, 0));

    expect(mockGetBooks).not.toHaveBeenCalled();
    expect(mockGetStudents).not.toHaveBeenCalled();
  });

  // ── LM-03 ──────────────────────────────────────────────────────────────
  test('LM-03 · Carrega estudantes e livros ao abrir e exibe opções', async () => {
    renderModal();

    await waitFor(() => {
      expect(mockGetBooks).toHaveBeenCalledTimes(1);
      expect(mockGetStudents).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Ana Silva')).toBeInTheDocument();
      expect(screen.getByText('Bruno Lima')).toBeInTheDocument();
      expect(screen.getByText('Fundação')).toBeInTheDocument();
      expect(screen.getByText('Isaac Asimov')).toBeInTheDocument();
    });
  });

  // ── LM-04 ──────────────────────────────────────────────────────────────
  test('LM-04 · Filtrar por autor exibe apenas livros daquele autor', async () => {
    const user = userEvent.setup();
    renderModal();

    await waitFor(() => expect(screen.getByText('Isaac Asimov')).toBeInTheDocument());

    const selects = screen.getAllByRole('combobox');
    const authorSelect = selects[2];
    await user.selectOptions(authorSelect, 'auth-1');

    await waitFor(() => {
      expect(screen.getByText('Fundação')).toBeInTheDocument();
      expect(screen.getByText('Robôs e Império')).toBeInTheDocument();
      expect(screen.queryByText('Dom Casmurro')).not.toBeInTheDocument();
    });
  });

  // ── LM-05 ──────────────────────────────────────────────────────────────
  test('LM-05 · Selecionar livro preenche automaticamente o autor', async () => {
    const user = userEvent.setup();
    renderModal();

    await waitFor(() => expect(screen.getByText('Dom Casmurro')).toBeInTheDocument());

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[1], 'bk-2');

    await waitFor(() => {
      expect((selects[2] as HTMLSelectElement).value).toBe('auth-2');
    });
  });

  // ── LM-06 ──────────────────────────────────────────────────────────────
  test('LM-06 · Submit sem estudante chama showError e não cria empréstimo', async () => {
    const user = userEvent.setup();
    renderModal();

    await waitFor(() => expect(screen.getByText('Fundação')).toBeInTheDocument());

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[1], 'bk-1');

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(mockShowError).toHaveBeenCalledWith('Erro', 'Selecione um estudante.');
    expect(mockCreateLoan).not.toHaveBeenCalled();
  });

  // ── LM-07 ──────────────────────────────────────────────────────────────
  test('LM-07 · Submit sem livro chama showError e não cria empréstimo', async () => {
    const user = userEvent.setup();
    renderModal();

    await waitFor(() => expect(screen.getByText('Ana Silva')).toBeInTheDocument());

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'stu-1');

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    expect(mockShowError).toHaveBeenCalledWith('Erro', 'Selecione um livro.');
    expect(mockCreateLoan).not.toHaveBeenCalled();
  });

  // ── LM-08 ──────────────────────────────────────────────────────────────
  test('LM-08 · Submit válido chama createLoan com origin "admin" e dados corretos', async () => {
    const user = userEvent.setup();
    mockCreateLoan.mockResolvedValueOnce({ id: 'loan-new' });
    renderModal();

    await waitFor(() => {
      expect(screen.getByText('Ana Silva')).toBeInTheDocument();
      expect(screen.getByText('Fundação')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'stu-1');
    await user.selectOptions(selects[1], 'bk-1');

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => expect(mockCreateLoan).toHaveBeenCalledTimes(1));
    expect(mockCreateLoan).toHaveBeenCalledWith(
      expect.objectContaining({ bookId: 'bk-1', userId: 'stu-1' }),
      'admin',
    );
  });

  // ── LM-09 ──────────────────────────────────────────────────────────────
  test('LM-09 · Sucesso na criação chama showSuccess', async () => {
    const user = userEvent.setup();
    mockCreateLoan.mockResolvedValueOnce({ id: 'ok' });
    renderModal();

    await waitFor(() => {
      expect(screen.getByText('Ana Silva')).toBeInTheDocument();
      expect(screen.getByText('Fundação')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'stu-1');
    await user.selectOptions(selects[1], 'bk-1');

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Sucesso!',
        'Empréstimo criado com sucesso!',
        expect.any(Function),
      );
    });
  });

  // ── LM-10 ──────────────────────────────────────────────────────────────
  test('LM-10 · Erro na criação chama showError com mensagem da exceção', async () => {
    const user = userEvent.setup();
    mockCreateLoan.mockRejectedValueOnce(new Error('Livro já emprestado'));
    renderModal();

    await waitFor(() => {
      expect(screen.getByText('Ana Silva')).toBeInTheDocument();
      expect(screen.getByText('Fundação')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    await user.selectOptions(selects[0], 'stu-1');
    await user.selectOptions(selects[1], 'bk-1');

    await user.click(screen.getByRole('button', { name: 'Adicionar' }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Erro', 'Livro já emprestado');
    });
  });
});
