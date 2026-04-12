import type { Request, Response } from 'express';

import { AddBookToWishlistSchema } from '@/models/WishlistModel';
import { addBookToWishlist, getWishlistByUserId, deleteBookFromWishlist } from '@/services';
import { handleError, sendFailure, sendSuccess } from '@/utils';

export async function addBookToWishlistController(req: Request, res: Response) {
  try {
    const data = AddBookToWishlistSchema.parse(req.body);

    await addBookToWishlist(data);

    return sendSuccess(res, `Livro adicionado na sua lista de desejos`, 201);
  } catch (error: any) {
    return handleError(res, error, 'Lista de Desejos');
  }
}

export async function getWishlistByUserIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do usuário inválido.');
    }

    const wishlist = await getWishlistByUserId(id as string);

    if (wishlist.books.length === 0) {
      return sendFailure(res, 'NOT_FOUND', 'Nenhum livro encontrado na lista de desejos', undefined, 404);
    }

    return sendSuccess(res, wishlist, 200);
  } catch (error: any) {
    return handleError(res, error, 'Lista de Desejos');
  }
}

export async function deleteBookFromWishlistController(req: Request, res: Response) {
  try {
    const { studentId, bookId } = req.params;

    if (!studentId || Array.isArray(studentId) || !bookId || Array.isArray(bookId)) {
      throw new Error('O ID informado (usuário ou livro) não é válido..');
    }

    await deleteBookFromWishlist(studentId as string, bookId as string);

    return sendSuccess(res, `Livro removido da sua lista de desejos`, 202);
  } catch (error: any) {
    return handleError(res, error, 'Lista de Desejos');
  }
}
