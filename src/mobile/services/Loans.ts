import { LoanForm } from '@/types/formTypes';
import { apiFetch } from '@/util/api';

function localDateIso(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function extractZodErrors(obj: any): string[] {
  if (!obj || typeof obj !== 'object') return [];
  const msgs: string[] = [];
  if (Array.isArray(obj._errors) && obj._errors.length > 0) msgs.push(...obj._errors);
  for (const [k, v] of Object.entries(obj))
    if (k !== '_errors') msgs.push(...extractZodErrors(v));
  return msgs;
}

export async function getLoans() {
  try {
    const res = await apiFetch('/loans', { auth: true });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error('Error fetching loans:', error);
    return [];
  }
}

export async function getLoansByStatus(status: string) {
  try {
    const res = await apiFetch(`/loans/status/${status}`, { auth: true });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch (error) {
    console.error('Error fetching loans by status:', error);
    return [];
  }
}

export async function checkOverdueLoans() {
  try {
    await apiFetch('/loans/check-overdue', { method: 'POST', auth: true });
  } catch {
  }
}

type LoanUpdate = Partial<LoanForm> & {
  status?: string;
  dueDate?: string;
  returnDate?: string;
  justification?: string;
};

export async function updateLoan(id: string, data: LoanUpdate) {
  try {
    const res = await apiFetch(`/loans/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      let msg = '';
      
      if (body?.details && typeof body.details === 'object') {
        const zodErrors = extractZodErrors(body.details);
        if (zodErrors.length > 0) msg = zodErrors.join('\n');
      }
      if (!msg) {
        msg = body?.message || `Erro ${res.status} ao atualizar empréstimo`;
      }
      
      throw new Error(msg);
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
}

export async function createLoan(loan: LoanForm, origin?: 'student' | 'admin') {
  const { bookId, userId, loanDate, returnDate } = loan;

  const res = await apiFetch('/loans', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({
      studentId: userId,
      bookId,
      loanDate: loanDate ?? localDateIso(0),
      dueDate: returnDate,
      status: origin === 'student' ? 'pending' : 'in_progress',
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    let msg = '';
    if (body?.details && typeof body.details === 'object') {
      const zodErrors = extractZodErrors(body.details);
      if (zodErrors.length > 0) msg = zodErrors.join('\n');
    }
    if (!msg) {
      msg = body?.message || `Erro ${res.status} ao registrar empréstimo`;
      if (msg === 'Request validation failed') msg = `Erro ${res.status} ao registrar empréstimo`;
    }
    throw new Error(msg);
  }

  const response = await res.json();
  return response.data;
}

export async function getLoansByUserId(userId: string) {
  const res = await apiFetch(`/loans/student/${userId}`, { auth: true });
  const data = await res.json();
  return data.data || data;
}

export async function updateLoanDueDate(loanId: string, newDate: string) {
  const res = await apiFetch(`/loans/${loanId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({ dueDate: newDate, status: 'in_progress' }),
  });
  if (!res.ok) throw new Error('Erro ao atualizar no banco');
  return res.json();
}

export async function returnLoanStatus(loanId: string, returnDate: string, justification?: string) {
  const payload: Record<string, string> = { status: 'returned', returnDate };
  if (justification) payload.justification = justification;

  const res = await apiFetch(`/loans/${loanId}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Erro no banco');
  return res.json();
}