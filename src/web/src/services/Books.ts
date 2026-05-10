import { BookForm } from '@/types/formTypes';
import { apiFetch } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function getBooks(search?: string) {
  const query = new URLSearchParams();

  if (search) query.append('search', search);

  const res = await fetch(`${API_URL}/books?${query.toString()}`, {
    cache: 'no-store',
  });

  const data = await res.json();

  return data.data;
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/books/categories`, {
    cache: 'no-store',
  });

  const data = await res.json();

  return data.data;
}

export async function getBookBySlug(slug: string) {
  const res = await fetch(`${API_URL}/books/${slug}`, {
    cache: 'no-store',
  });

  const data = await res.json();

  return data.data;
}

export async function getReviewsByBookId(id: string) {
  const res = await fetch(`${API_URL}/review/book/${id}`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.data;
}
function extractZodErrors(obj: any): string[] {
  if (!obj || typeof obj !== 'object') return [];
  const msgs: string[] = [];
  if (Array.isArray(obj._errors) && obj._errors.length > 0) msgs.push(...obj._errors);
  for (const [key, val] of Object.entries(obj)) {
    if (key !== '_errors') msgs.push(...extractZodErrors(val));
  }
  return msgs;
}

function extractErrorMessage(body: any, fallback: string): string {
  if (body?.details && typeof body.details === 'object') {
    const zodErrors = extractZodErrors(body.details);
    if (zodErrors.length > 0) return zodErrors.join('\n');
  }
  const msg = body?.message ?? body?.error ?? body?.detail;
  if (Array.isArray(msg)) return msg.join('\n');
  if (typeof msg === 'string' && msg.length > 0 && msg !== 'Request validation failed') return msg;
  return fallback;
}

export async function addNewBook(book: BookForm) {
  const res = await apiFetch('/books/register', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(extractErrorMessage(body, `Erro ${res.status} ao criar livro`));
  }

  const data = await res.json();
  return data.data;
}

export async function updateBook(id: string, book: BookForm) {
  const res = await apiFetch(`/books/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(extractErrorMessage(body, `Erro ${res.status} ao atualizar livro`));
  }

  const data = await res.json();
  return data.data;
}

export async function deleteBook(id: string) {
  const res = await apiFetch(`/books/${id}`, {
    method: 'DELETE',
    auth: true,
  });

  const data = await res.json().catch(() => null);

  return {
    status: res.status,
    data,
  };
}

export async function createReview(data: { loanId: string; rating: number; description?: string; date: string }) {
  const res = await apiFetch('/review', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao criar avaliação');
  }

  return res.json();
}