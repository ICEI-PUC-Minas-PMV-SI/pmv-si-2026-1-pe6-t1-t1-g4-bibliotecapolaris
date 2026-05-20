import { getWishlistByUserId } from '@/services/Wishlist';
import { toggleWishlist } from '@/util/ToggleFavorite';
import { useEffect, useMemo, useState } from 'react';

export function useWishlist(userId: string) {
  const [wishlist, setWishlist] = useState<{ books: any[] }>({ books: [] });

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
      await toggleWishlist({
        userId,
        bookId,
        isFavorite,
        setWishlist,
      });

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message ?? 'Erro ao atualizar wishlist',
      };
    }
  }

  return {
    wishlist,
    wishlistSet,
    toggle,
  };
}
