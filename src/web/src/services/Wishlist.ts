import { apiFetch } from '@/lib/api';

export async function addBookToWishlist(studentId: string, bookId: string) {
  const res = await apiFetch('/wishlist/register', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ studentId, bookId }),
  });
  if (res.status === 401) return;
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao adicionar à wishlist');
  }
  const data = await res.json();
  return data.data;
}

export async function removeBookFromWishlist(studentId: string, bookId: string) {
  const res = await apiFetch(`/wishlist/${studentId}/${bookId}`, {
    method: 'DELETE',
    auth: true,
  });
  if (res.status === 401) return;
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao remover da wishlist');
  }
  const data = await res.json();
  return data.data;
}

export async function getWishlistByUserId(studentId: string) {
  if (!studentId) return { books: [] };
  const res = await apiFetch(`/wishlist/${studentId}`, {
    auth: true,
    silentUnauthorized: true,
    cache: 'no-store',
  } as any);
  if (res.status === 401 || res.status === 404) return { books: [] };
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao buscar wishlist');
  }
  const data = await res.json();
  return data.data ?? { books: [] };
}
