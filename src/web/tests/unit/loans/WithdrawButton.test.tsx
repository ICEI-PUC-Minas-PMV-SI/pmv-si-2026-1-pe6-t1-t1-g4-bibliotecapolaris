/**
 * Testes Unitários — WithdrawButton
 *
 * Cobre o fluxo completo de retirada de livro pelo estudante:
 *   - renderização do botão
 *   - guard de autenticação
 *   - abertura do modal de confirmação
 *   - seleção de prazo (7 ou 14 dias)
 *   - formato brasileiro da data de devolução
 *   - chamada correta a createLoan com origin "student"
 *   - fluxos de sucesso e erro
 *
 * Dependências mockadas:
 *   - @/context/AuthContext → useAuth
 *   - @/services/Loans      → createLoan
 *   - @/hooks/useAlertModal → showSuccess, showError
 *   - next/image            → <img> simples para o jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { WithdrawButton } from '@/components/Book/WithdrawButton';

// ─── Mocks ───────────────────────────────────────────────────────────────────

// WithdrawButton importa @/components barrel que puxa módulos com dependência em apiFetch
jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ fill, onError, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const mockCreateLoan = jest.fn();
jest.mock('@/services/Loans', () => ({
  createLoan: (...args: unknown[]) => mockCreateLoan(...args),
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

// mockUser é acessível no factory porque o nome começa com "mock" (exceção do Jest)
let mockUser: { id: string; name: string; email: string; slug: string; type: string } | null = null;
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

// ─── Dados de Teste ──────────────────────────────────────────────────────────

const MOCK_BOOK = { id: 'book-42', name: 'O Senhor dos Anéis', imageSrc: '/cover.jpg' };
const MOCK_USER = { id: 'u1', name: 'Alice', email: 'alice@test.com', slug: 'alice', type: 'student' };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderButton(book = MOCK_BOOK) {
  return render(<WithdrawButton book={book} />);
}

// ─── Testes ──────────────────────────────────────────────────────────────────

describe('WithdrawButton — Retirada de Livros', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockUser = null;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // ── WB-01 ──────────────────────────────────────────────────────────────
  test('WB-01 · Renderiza o botão "Retirar"', () => {
    renderButton();

    expect(screen.getByRole('button', { name: 'Retirar' })).toBeInTheDocument();
  });

  // ── WB-02 ──────────────────────────────────────────────────────────────
  test('WB-02 · Modal de confirmação não é visível antes do clique', () => {
    renderButton();

    expect(screen.queryByText('Retirar livro')).not.toBeInTheDocument();
    expect(screen.queryByText('Prazo de devolução')).not.toBeInTheDocument();
  });

  // ── WB-03 ──────────────────────────────────────────────────────────────
  test('WB-03 · Usuário não autenticado: clique exibe erro e não abre modal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = null;
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));

    expect(mockShowError).toHaveBeenCalledWith(
      'Não autenticado',
      'Faça login para retirar um livro.',
    );
    expect(screen.queryByText('Retirar livro')).not.toBeInTheDocument();
  });

  // ── WB-04 ──────────────────────────────────────────────────────────────
  test('WB-04 · Usuário autenticado: clique abre o modal com nome do livro', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));

    expect(screen.getByText('Retirar livro')).toBeInTheDocument();
    expect(screen.getByText('O Senhor dos Anéis')).toBeInTheDocument();
  });

  // ── WB-05 ──────────────────────────────────────────────────────────────
  test('WB-05 · Botões de prazo "7 dias" e "14 dias" são exibidos no modal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));

    expect(screen.getByRole('button', { name: '7 dias' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '14 dias' })).toBeInTheDocument();
  });

  // ── WB-06 ──────────────────────────────────────────────────────────────
  test('WB-06 · Selecionar "14 dias" atualiza a data exibida corretamente', async () => {
    jest.setSystemTime(new Date('2026-05-10T12:00:00'));
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));
    await user.click(screen.getByRole('button', { name: '14 dias' }));

    // 10/05 + 14 dias = 24/05/2026
    expect(screen.getByText(/Devolução até:/)).toHaveTextContent('Devolução até: 24/05/2026');
  });

  // ── WB-07 ──────────────────────────────────────────────────────────────
  test('WB-07 · Data de devolução é exibida no formato dd/mm/aaaa', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));

    const dateText = screen.getByText(/Devolução até:/).textContent ?? '';
    expect(dateText).toMatch(/Devolução até: \d{2}\/\d{2}\/\d{4}/);
  });

  // ── WB-08 ──────────────────────────────────────────────────────────────
  test('WB-08 · Botão "Cancelar" fecha o modal sem criar empréstimo', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));
    expect(screen.getByText('Retirar livro')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByText('Retirar livro')).not.toBeInTheDocument();
    expect(mockCreateLoan).not.toHaveBeenCalled();
  });

  // ── WB-09 ──────────────────────────────────────────────────────────────
  test('WB-09 · Confirmar chama createLoan com bookId, userId e origin "student"', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    mockCreateLoan.mockResolvedValueOnce({ id: 'loan-new' });
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => expect(mockCreateLoan).toHaveBeenCalledTimes(1));
    expect(mockCreateLoan).toHaveBeenCalledWith(
      expect.objectContaining({ bookId: 'book-42', userId: 'u1' }),
      'student',
    );
  });

  // ── WB-10 ──────────────────────────────────────────────────────────────
  test('WB-10 · Confirmar com "14 dias" envia returnDate 14 dias à frente de hoje', async () => {
    jest.setSystemTime(new Date('2026-05-10T12:00:00'));
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    mockCreateLoan.mockResolvedValueOnce({ id: 'ok' });
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));
    await user.click(screen.getByRole('button', { name: '14 dias' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => expect(mockCreateLoan).toHaveBeenCalledTimes(1));
    const callArg = mockCreateLoan.mock.calls[0][0];
    expect(callArg.returnDate).toBe('2026-05-24');
  });

  // ── WB-11 ──────────────────────────────────────────────────────────────
  test('WB-11 · Sucesso exibe showSuccess e fecha o modal', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    mockCreateLoan.mockResolvedValueOnce({ id: 'ok' });
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => {
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Solicitação enviada!',
        'Sua retirada foi registrada e aguarda aprovação da biblioteca.',
      );
    });

    // Aguarda a re-renderização que fecha o modal (setOpen(false) é batched com setSubmitting)
    await waitFor(() => {
      expect(screen.queryByText('Retirar livro')).not.toBeInTheDocument();
    });
  });

  // ── WB-12 ──────────────────────────────────────────────────────────────
  test('WB-12 · Erro na criação exibe showError com mensagem da exceção', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    mockUser = MOCK_USER;
    mockCreateLoan.mockRejectedValueOnce(new Error('Estoque esgotado'));
    renderButton();

    await user.click(screen.getByRole('button', { name: 'Retirar' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar' }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Erro', 'Estoque esgotado');
    });
  });
});
