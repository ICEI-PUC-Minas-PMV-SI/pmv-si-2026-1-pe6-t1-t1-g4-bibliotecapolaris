import { LoanForm } from '@/types/formTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getLoans() {
  try {
    const res = await fetch(`${API_URL}/loans`, {
      cache: 'no-store',
    });

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
    const res = await fetch(`${API_URL}/loans/status/${status}`, {
      cache: 'no-store',
    });

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
    const res = await fetch(`${API_URL}/loans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: userId,
        bookId,
        loanDate: finalLoanDate,
        dueDate: returnDate,
        status: 'in_progress',
      }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.message || 'Erro ao registrar empréstimo');
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
}

export async function updateLoan(id: string, data: Partial<LoanForm> & { status: string }) {
  try {
    const res = await fetch(`${API_URL}/loans/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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

export async function deleteLoan(id: string) {
  try {
    const res = await fetch(`${API_URL}/loans/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
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
