/**
 * Testes Unitários — Loans Service
 *
 * Cobre as funções do serviço de empréstimos:
 *   getLoans, getLoansByStatus, createLoan, updateLoan,
 *   checkOverdueLoans, deleteLoan
 *
 * A dependência externa é mockada:
 *   - @/lib/api → apiFetch
 */

import {
  getLoans,
  getLoansByStatus,
  createLoan,
  updateLoan,
  checkOverdueLoans,
  deleteLoan,
} from '@/services/Loans';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockApiFetch = jest.fn();

jest.mock('@/lib/api', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mockResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: jest.fn().mockResolvedValue(data),
  };
}

// ─── Testes ──────────────────────────────────────────────────────────────────

describe('Loans Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── SRV-01 ──────────────────────────────────────────────────────────────
  test('SRV-01 · getLoans retorna array de empréstimos em sucesso', async () => {
    const loans = [{ id: '1', status: 'in_progress' }, { id: '2', status: 'pending' }];
    mockApiFetch.mockResolvedValueOnce(mockResponse({ data: loans }));

    const result = await getLoans();

    expect(result).toEqual(loans);
    expect(mockApiFetch).toHaveBeenCalledWith('/loans', { auth: true });
  });

  // ── SRV-02 ──────────────────────────────────────────────────────────────
  test('SRV-02 · getLoans retorna [] quando resposta não é ok', async () => {
    mockApiFetch.mockResolvedValueOnce(mockResponse({}, false, 500));

    const result = await getLoans();

    expect(result).toEqual([]);
  });

  // ── SRV-03 ──────────────────────────────────────────────────────────────
  test('SRV-03 · getLoans retorna [] em caso de erro de rede', async () => {
    mockApiFetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getLoans();

    expect(result).toEqual([]);
  });

  // ── SRV-04 ──────────────────────────────────────────────────────────────
  test('SRV-04 · getLoansByStatus retorna empréstimos filtrados por status', async () => {
    const pending = [{ id: '1', status: 'pending' }];
    mockApiFetch.mockResolvedValueOnce(mockResponse({ data: pending }));

    const result = await getLoansByStatus('pending');

    expect(result).toEqual(pending);
    expect(mockApiFetch).toHaveBeenCalledWith('/loans/status/pending', { auth: true });
  });

  // ── SRV-05 ──────────────────────────────────────────────────────────────
  test('SRV-05 · getLoansByStatus retorna [] quando não há resultados', async () => {
    mockApiFetch.mockResolvedValueOnce(mockResponse({ data: [] }));

    const result = await getLoansByStatus('overdue');

    expect(result).toEqual([]);
  });

  // ── SRV-06 ──────────────────────────────────────────────────────────────
  test('SRV-06 · createLoan com origin "student" envia status "pending"', async () => {
    mockApiFetch.mockResolvedValueOnce(mockResponse({ data: { id: 'loan-1' } }));

    await createLoan(
      { bookId: 'b1', userId: 'u1', loanDate: '2026-05-10', returnDate: '2026-05-17' },
      'student',
    );

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.status).toBe('pending');
  });

  // ── SRV-07 ──────────────────────────────────────────────────────────────
  test('SRV-07 · createLoan com origin "admin" envia status "in_progress"', async () => {
    mockApiFetch.mockResolvedValueOnce(mockResponse({ data: { id: 'loan-1' } }));

    await createLoan(
      { bookId: 'b1', userId: 'u1', loanDate: '2026-05-10', returnDate: '2026-05-17' },
      'admin',
    );

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.status).toBe('in_progress');
  });

  // ── SRV-08 ──────────────────────────────────────────────────────────────
  test('SRV-08 · createLoan sem origin envia status "in_progress"', async () => {
    mockApiFetch.mockResolvedValueOnce(mockResponse({ data: { id: 'loan-1' } }));

    await createLoan({ bookId: 'b1', userId: 'u1', loanDate: '2026-05-10', returnDate: '2026-05-17' });

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.status).toBe('in_progress');
  });

  // ── SRV-09 ──────────────────────────────────────────────────────────────
  test('SRV-09 · createLoan envia bookId, studentId e dueDate corretos', async () => {
    mockApiFetch.mockResolvedValueOnce(mockResponse({ data: { id: 'ok' } }));

    await createLoan(
      { bookId: 'book-123', userId: 'user-456', loanDate: '2026-05-10', returnDate: '2026-05-24' },
      'admin',
    );

    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.bookId).toBe('book-123');
    expect(body.studentId).toBe('user-456');
    expect(body.dueDate).toBe('2026-05-24');
  });

  // ── SRV-10 ──────────────────────────────────────────────────────────────
  test('SRV-10 · createLoan lança erro com mensagem da API quando resposta não é ok', async () => {
    mockApiFetch.mockResolvedValueOnce(
      mockResponse({ message: 'Livro indisponível' }, false, 422),
    );

    await expect(
      createLoan({ bookId: 'b1', userId: 'u1', loanDate: '2026-05-10', returnDate: '2026-05-17' }),
    ).rejects.toThrow('Livro indisponível');
  });

  // ── SRV-11 ──────────────────────────────────────────────────────────────
  test('SRV-11 · updateLoan envia PUT e retorna dados atualizados', async () => {
    mockApiFetch.mockResolvedValueOnce(
      mockResponse({ data: { id: 'loan-1', status: 'returned' } }),
    );

    const result = await updateLoan('loan-1', { status: 'returned' });

    expect(result).toEqual({ id: 'loan-1', status: 'returned' });
    expect(mockApiFetch).toHaveBeenCalledWith(
      '/loans/loan-1',
      expect.objectContaining({ method: 'PUT', auth: true }),
    );
    const body = JSON.parse(mockApiFetch.mock.calls[0][1].body);
    expect(body.status).toBe('returned');
  });

  // ── SRV-12 ──────────────────────────────────────────────────────────────
  test('SRV-12 · updateLoan lança erro em resposta não-ok', async () => {
    mockApiFetch.mockResolvedValueOnce(
      mockResponse({ message: 'Empréstimo não encontrado' }, false, 404),
    );

    await expect(updateLoan('missing-id', { status: 'returned' })).rejects.toThrow(
      'Empréstimo não encontrado',
    );
  });

  // ── SRV-13 ──────────────────────────────────────────────────────────────
  test('SRV-13 · checkOverdueLoans envia POST para /loans/check-overdue', async () => {
    mockApiFetch.mockResolvedValueOnce({ ok: true, json: jest.fn() });

    await checkOverdueLoans();

    expect(mockApiFetch).toHaveBeenCalledWith('/loans/check-overdue', {
      method: 'POST',
      auth: true,
    });
  });

  // ── SRV-14 ──────────────────────────────────────────────────────────────
  test('SRV-14 · checkOverdueLoans falha silenciosamente sem propagar erro', async () => {
    mockApiFetch.mockRejectedValueOnce(new Error('Server unavailable'));

    await expect(checkOverdueLoans()).resolves.toBeUndefined();
  });

  // ── SRV-15 ──────────────────────────────────────────────────────────────
  test('SRV-15 · deleteLoan envia DELETE e retorna status HTTP e data', async () => {
    const payload = { data: { id: 'loan-99', deleted: true } };
    const mockRes = {
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(payload),
    };
    mockApiFetch.mockResolvedValueOnce(mockRes);

    const result = await deleteLoan('loan-99');

    expect(result).toEqual({ status: 200, data: payload });
    expect(mockApiFetch).toHaveBeenCalledWith('/loans/loan-99', {
      method: 'DELETE',
      auth: true,
    });
  });
});
