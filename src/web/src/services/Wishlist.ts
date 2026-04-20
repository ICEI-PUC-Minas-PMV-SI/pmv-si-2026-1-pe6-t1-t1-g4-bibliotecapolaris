export async function addBookToWishlist(userId: string, bookId: string) {
  const res = await fetch(`http://localhost:3333/api/wishlist/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, bookId }),
  });

  const data = await res.json();
  return data.data;
}

export async function removeBookFromWishlist(userId: string, bookId: string) {
  const res = await fetch(`http://localhost:3333/api/wishlist/${userId}/${bookId}`, { method: 'DELETE' });

  const data = await res.json();
  return data.data;
}

export async function getWishlistByUserId(userId: string) {
  const res = await fetch(`http://localhost:3333/api/wishlist/${userId}`, {
    cache: 'no-store',
  });

  const data = await res.json();
  return data.data;
}
