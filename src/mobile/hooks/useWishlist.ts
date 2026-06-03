import { getWishlistByUserId } from '@/services/Wishlist';
import { toggleWishlist } from '@/util/ToggleFavorite';
import { useEffect, useMemo, useState } from 'react';

export function useWishlist(userId: string) {
  const [wishlist, setWishlist] = useState<{ books: any[] }>({ books: [] });

  useEffect(() => {
    if (!userId) return;

    async function load() {
      try {
        const data = await getWishlistByUserId(userId);
        setWishlist(data ?? { books: [] });
      } catch {
        // usuário não autenticado ou sem wishlist — ignora silenciosamente
      }
    }

    load();
  }, [userId]);

  const wishlistSet = useMemo(() => new Set(wishlist.books.map((b) => b.id)), [wishlist]);

  async function toggle(bookId: string) {
    if (!userId) return { success: false, error: 'Faça login para usar a wishlist' };

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
