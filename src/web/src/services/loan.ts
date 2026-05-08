import { apiFetch } from '@/lib/api';

export async function getLoansByUserId(userId: string) {
  const res = await apiFetch(`/loans/student/${userId}`, {
    auth: true,
    cache: 'no-store',
  });

  const data = await res.json();
  return data.data || data;
}

export async function updateLoanDueDate(loanId: string, newDate: string) {
  const response = await apiFetch(`/loans/${loanId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({ dueDate: newDate, status: 'in_progress' }),
  });

  if (!response.ok) throw new Error('Erro ao atualizar no banco');
  return response.json();
}

export async function returnLoanStatus(loanId: string, returnDate: string, justification?: string) {
  const payload: any = { status: 'returned', returnDate };
  if (justification) payload.justification = justification;

  const response = await apiFetch(`/loans/${loanId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error('Erro no banco');
  return response.json();
}
