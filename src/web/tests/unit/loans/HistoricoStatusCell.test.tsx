/**
 * Testes Unitários — HistoricoStatusCell
 *
 * Cobre todos os ramos de lógica da célula de status do histórico:
 *   - Devolvido no prazo     (returnDate presente e <= dueDate)
 *   - Devolvido com atraso   (returnDate presente e > dueDate)
 *   - Em atraso não devolvido (status = overdue, sem returnDate)
 *   - Cancelado               (status = canceled, sem returnDate)
 *   - Em andamento            (demais casos, sem returnDate)
 *   - Dados ausentes          (params.data = null)
 *
 * Verifica rótulo (label) e cor de fundo (backgroundColor) de cada estado.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { HistoricoStatusCell } from '@/components/Grid/Cells/GridCells';

// GridCells importa @/components barrel que puxa módulos com dependência em apiFetch
jest.mock('@/lib/api', () => ({ apiFetch: jest.fn() }));

// ─── Helpers ─────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCell(data: any) {
  return render(<HistoricoStatusCell data={data} />);
}

// ─── Testes ──────────────────────────────────────────────────────────────────

describe('HistoricoStatusCell — Status do Histórico de Empréstimos', () => {
  // ── HSC-01 ──────────────────────────────────────────────────────────────
  test('HSC-01 · Exibe "Devolvido no prazo" (verde) quando returnDate <= dueDate', () => {
    renderCell({ dueDate: '2026-05-15', returnDate: '2026-05-10', status: 'returned' });

    const span = screen.getByText('Devolvido no prazo');
    expect(span).toBeInTheDocument();
    expect(span).toHaveStyle({ backgroundColor: '#00ff2f' });
  });

  // ── HSC-02 ──────────────────────────────────────────────────────────────
  test('HSC-02 · Exibe "Devolvido com atraso" (vermelho) quando returnDate > dueDate', () => {
    renderCell({ dueDate: '2026-05-10', returnDate: '2026-05-20', status: 'returned' });

    const span = screen.getByText('Devolvido com atraso');
    expect(span).toBeInTheDocument();
    expect(span).toHaveStyle({ backgroundColor: '#e53a41' });
  });

  // ── HSC-03 ──────────────────────────────────────────────────────────────
  test('HSC-03 · Exibe "Em atraso — não devolvido" (vermelho) quando status é overdue', () => {
    renderCell({ dueDate: '2026-05-01', returnDate: null, status: 'overdue' });

    const span = screen.getByText('Em atraso — não devolvido');
    expect(span).toBeInTheDocument();
    expect(span).toHaveStyle({ backgroundColor: '#e53a41' });
  });

  // ── HSC-04 ──────────────────────────────────────────────────────────────
  test('HSC-04 · Exibe "Cancelado" (vermelho escuro) quando status é canceled', () => {
    renderCell({ dueDate: '2026-05-10', returnDate: null, status: 'canceled' });

    const span = screen.getByText('Cancelado');
    expect(span).toBeInTheDocument();
    expect(span).toHaveStyle({ backgroundColor: '#a93226' });
  });

  // ── HSC-05 ──────────────────────────────────────────────────────────────
  test('HSC-05 · Exibe "Em andamento" (amarelo) quando status é in_progress sem returnDate', () => {
    renderCell({ dueDate: '2026-05-20', returnDate: null, status: 'in_progress' });

    const span = screen.getByText('Em andamento');
    expect(span).toBeInTheDocument();
    expect(span).toHaveStyle({ backgroundColor: '#c9a227' });
  });

  // ── HSC-06 ──────────────────────────────────────────────────────────────
  test('HSC-06 · Renderiza sem erro e exibe "Em andamento" quando params.data é null', () => {
    renderCell(null);

    // Com data nula, todos os campos são undefined; cai no bloco else (Em andamento)
    expect(screen.getByText('Em andamento')).toBeInTheDocument();
  });
});
