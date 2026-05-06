import { apiFetch } from '@/lib/api';

export async function addBookToWishlist(studentId: string, bookId: string) {
  const res = await apiFetch('/wishlist/register', {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ studentId, bookId }),
  });
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
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao remover da wishlist');
  }
  const data = await res.json();
  return data.data;
}

export async function getWishlistByUserId(studentId: string) {
  const res = await apiFetch(`/wishlist/${studentId}`, {
    auth: true,
    cache: 'no-store',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao buscar wishlist');
  }
  const data = await res.json();
  return data.data;
}
