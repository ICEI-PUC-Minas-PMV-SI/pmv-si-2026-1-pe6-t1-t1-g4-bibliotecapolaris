const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function addBookToWishlist(userId: string, bookId: string) {
  const res = await fetch(`${API_URL}/wishlist/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, bookId }),
  });

  const data = await res.json();
  return data.data;
}

export async function removeBookFromWishlist(userId: string, bookId: string) {
  const res = await fetch(`${API_URL}/wishlist/${userId}/${bookId}`, { method: 'DELETE' });

  const data = await res.json();
  return data.data;
}

export async function getWishlistByUserId(userId: string) {
  const res = await fetch(`${API_URL}/wishlist/${userId}`, {
    cache: 'no-store',
  });

  const data = await res.json();
  return data.data;
}
