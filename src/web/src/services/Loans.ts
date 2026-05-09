import { LoanForm } from '@/types/formTypes';
import { apiFetch } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function createLoan(loan: LoanForm) {
  const { bookId, userId, loanDate, returnDate } = loan;
  const finalLoanDate = loanDate ?? formatDate(new Date());

  try {
    const res = await apiFetch('/loans', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        studentId: userId,
        bookId,
        loanDate: finalLoanDate,
        dueDate: returnDate,
        status: 'in_progress',
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const details = body?.details;
      let msg = '';
      if (details && typeof details === 'object') {
        const errs: string[] = [];
        const collect = (o: any) => {
          if (!o || typeof o !== 'object') return;
          if (Array.isArray(o._errors) && o._errors.length) errs.push(...o._errors);
          for (const [k, v] of Object.entries(o)) if (k !== '_errors') collect(v);
        };
        collect(details);
        msg = errs.join('\n');
      }
      if (!msg) msg = body?.message || `Erro ${res.status} ao registrar empréstimo`;
      if (msg === 'Request validation failed') msg = `Erro ${res.status} ao registrar empréstimo`;
      throw new Error(msg);
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
}

type LoanUpdate = Partial<LoanForm> & {
  status: string;
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
      const error = await res.json().catch(() => null);
      throw new Error(error?.message || 'Erro ao atualizar empréstimo');
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
}

export async function checkOverdueLoans() {
  try {
    await apiFetch('/loans/check-overdue', { method: 'POST', auth: true });
  } catch {
    // silently fail — não bloqueia o carregamento do painel
  }
}

export async function deleteLoan(id: string) {
  try {
    const res = await apiFetch(`/loans/${id}`, {
      method: 'DELETE',
      auth: true,
    });

    const data = await res.json().catch(() => null);

    return {
      status: res.status,
      data,
    };
  } catch (error) {
    console.error('Error deleting loan:', error);
    throw error;
  }
}
