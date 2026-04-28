import { getWishlistByUserId } from '@/services/Wishlist';
import { toggleWishlist } from '@/util/ToggleFavorite';
import { useEffect, useMemo, useState } from 'react';

export function useWishlist(userId: string) {
  const [wishlist, setWishlist] = useState<{ books: any[] }>({ books: [] });
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    async function load() {
      const data = await getWishlistByUserId(userId);
      setWishlist(data ?? { books: [] });
    }

    load();
  }, [userId]);

  const wishlistSet = useMemo(() => new Set(wishlist.books.map((b) => b.id)), [wishlist]);

  async function toggle(bookId: string) {
    const isFavorite = wishlistSet.has(bookId);

    try {
      setError(null);

      await toggleWishlist({
        userId,
        bookId,
        isFavorite,
        setWishlist,
      });

      return { success: true };
    } catch (error: any) {
      setError(error?.message || 'Erro ao atualizar wishlist');
      return { success: false, error };
    }
  }

  return {
    wishlist,
    wishlistSet,
    toggle,
    error,
    setError,
  };
}
