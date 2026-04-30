const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function addBookToWishlist(studentId: string, bookId: string) {
  const res = await fetch(`${API_URL}/wishlist/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
  const res = await fetch(`${API_URL}/wishlist/${studentId}/${bookId}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao remover da wishlist');
  }

  const data = await res.json();
  return data.data;
}

export async function getWishlistByUserId(studentId: string) {
  const res = await fetch(`${API_URL}/wishlist/${studentId}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || 'Erro ao buscar wishlist');
  }

  const data = await res.json();
  return data.data;
}
