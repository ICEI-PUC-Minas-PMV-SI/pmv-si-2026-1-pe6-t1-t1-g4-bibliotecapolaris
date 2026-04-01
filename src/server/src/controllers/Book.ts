import type { Request, Response } from 'express';

import { CreateBookSchema, UpdateBookSchema } from '@/models/BookModel';
import { createBook, deleteBook, getBookById, getBookBySlug, listBooks, updateBook } from '@/services';
import { handleError, sendFailure, sendSuccess } from '@/utils';

export async function createBookController(req: Request, res: Response) {
  try {
    const data = CreateBookSchema.parse(req.body);

    const newBook = await createBook(data);

    return sendSuccess(res, `Livro "${newBook.name}" criado com sucesso!`, 201);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}

export async function getBookByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do livro inválido.');
    }

    const book = await getBookById(id as string);

    return sendSuccess(res, book, 200);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}

export async function getBookBySlugController(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (!slug || Array.isArray(slug)) {
      throw new Error('Slug do livro inválido.');
    }

    const book = await getBookBySlug(slug as string);

    return sendSuccess(res, book, 200);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}

export async function listBooksController(req: Request, res: Response) {
  try {
    const { name, authorName, categories, wishlistId } = req.query;

    const filters: {
      name?: string;
      authorName?: string;
      categories?: string;
      wishlistId?: string;
    } = {};

    if (typeof name === 'string') filters.name = name;
    if (typeof authorName === 'string') filters.authorName = authorName;
    if (typeof categories === 'string') filters.categories = categories;
    if (typeof wishlistId === 'string') filters.wishlistId = wishlistId;

    const books = await listBooks(filters);

    if (books.length === 0) {
      return sendFailure(res, 'NOT_FOUND', 'Nenhum livro encontrado com os filtros informados', undefined, 404);
    }

    return sendSuccess(res, books, 200);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}

export async function updateBookController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do livro inválido.');
    }

    const data = UpdateBookSchema.parse(req.body);

    const updatedBook = await updateBook(id as string, data);

    return sendSuccess(res, `Dados do livro "${updatedBook.name}" atualizados com sucesso!`, 200);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}

export async function deleteBookController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do livro informado não é válido.');
    }

    const deletedBook = await deleteBook(id as string);

    return sendSuccess(res, `Livro "${deletedBook.name}" removido com sucesso do acervo`, 200);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}
