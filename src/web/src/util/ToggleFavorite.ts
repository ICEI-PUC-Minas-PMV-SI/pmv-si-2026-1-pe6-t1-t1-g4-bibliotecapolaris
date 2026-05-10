import { addBookToWishlist, removeBookFromWishlist } from '@/services/Wishlist';

type Params = {
  userId: string;
  bookId: string;
  isFavorite: boolean;
  setWishlist: React.Dispatch<any>;
};

export async function toggleWishlist({ userId, bookId, isFavorite, setWishlist }: Params) {
  if (isFavorite) {
    await removeBookFromWishlist(userId, bookId);

    setWishlist((prev: any) => ({
      books: prev.books.filter((b: any) => b.id !== bookId),
    }));
  } else {
    await addBookToWishlist(userId, bookId);

    setWishlist((prev: any) => ({
      books: [...prev.books, { id: bookId }],
    }));
  }
}
