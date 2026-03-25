import type { Request, Response } from 'express';

import { AddBookToWishlistSchema } from '@/models/WishlistModel';
import { addBookToWishlist, getWishlistByUserId, deleteBookFromWishlist } from '@/services';
import { handleError, sendSuccess } from '@/utils';

export async function addBookToWishlistController(req: Request, res: Response) {
  try {
    const data = AddBookToWishlistSchema.parse(req.body);

    const addedBook = await addBookToWishlist(data);

    return sendSuccess(
      res,
      `${addedBook.student.name} adicionou o livro ${addedBook.book.name} na sua lista de desejos`,
      201,
    );
  } catch (error: any) {
    return handleError(res, error, 'Lista de Desejos');
  }
}

export async function getWishlistByUserIdController(req: Request, res: Response) {
  try {
    const { studentId } = req.params;

    const wishlist = await getWishlistByUserId(studentId as string);

    return sendSuccess(res, wishlist, 200);
  } catch (error: any) {
    return handleError(res, error, 'Lista de Desejos');
  }
}

export async function deleteBookFromWishlistController(req: Request, res: Response) {
  try {
    const { studentId, bookId } = req.query;

    await deleteBookFromWishlist(studentId as string, bookId as string);

    return sendSuccess(res, `Livro removido da lista de desejos com sucesso`, 202);
  } catch (error: any) {
    return handleError(res, error, 'Lista de Desejos');
  }
}
