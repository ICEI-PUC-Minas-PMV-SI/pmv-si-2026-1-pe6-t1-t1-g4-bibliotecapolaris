import type { Request, Response } from 'express';

import { handleError, sendFailure, sendSuccess } from '@/utils';
import { createBook, getBookById, getBookBySlug, listBooks, updateBook, deleteBook } from '@/services';
import { CreateBookSchema, UpdateBookSchema } from '@/models/BookModel';

export async function createBookController(req: Request, res: Response) {
  try {
    const data = CreateBookSchema.parse(req.body);

    const newBook = await createBook(data);

    return sendSuccess(res, `Livro ${newBook.id} criado com sucesso!`, 201);
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function getBookByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const book = await getBookById(id as string);

    if (!book) {
      return sendFailure(res, '404', 'Livro não encontrado!');
    }

    return sendSuccess(res, book, 200);
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function getBookBySlugController(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const book = await getBookBySlug(slug as string);

    if (!book) {
      return sendFailure(res, '404', 'Livro não encontrado!');
    }

    return sendSuccess(res, book, 200);
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function listBooksController(req: Request, res: Response) {
  try {
    const { name, authorName, categories } = req.query;

    const filters: { name?: string; authorName?: string; categories?: string } = {};
    if (typeof name === 'string') filters.name = name;
    if (typeof authorName === 'string') filters.authorName = authorName;
    if (typeof categories === 'string') filters.categories = categories;

    const books = await listBooks(filters);

    return sendSuccess(res, books, 200);
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function updateBookController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do livro inválido.');
    }

    const data = UpdateBookSchema.parse(req.body);

    const updatedBook = await updateBook(id, data);

    return sendSuccess(res, `Livro - ${updatedBook.name} atualizado com sucesso!`, 202);
  } catch (error: unknown) {
    return handleError(res, error);
  }
}

export async function deleteBookController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await deleteBook(id as string);

    return sendSuccess(res, 'Livro deletado com sucesso', 202);
  } catch (error: any) {
    return handleError(res, error);
  }
}