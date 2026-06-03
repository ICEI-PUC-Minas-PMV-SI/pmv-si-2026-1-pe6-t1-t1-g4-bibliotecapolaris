import type { Request, Response } from 'express';

import { CreateBookSchema, UpdateBookSchema } from '@/models/BookModel';
import {
  createBook,
  deleteBook,
  findOrCreateAuthor,
  getBookById,
  getBookBySlug,
  listBooks,
  updateBook,
  listCategories,
} from '@/services';
import { handleError, sendFailure, sendSuccess } from '@/utils';

// --- OPERAÇÃO 1: CRIAÇÃO ---
export async function createBookController(req: Request, res: Response) {
  try {
    const { author, ...rest } = req.body;

    const authorId = await findOrCreateAuthor(author.name);

    const data = CreateBookSchema.parse({
      ...rest,
      authorId,
    });

    await createBook(data);

    return sendSuccess(res, `Livro criado com sucesso!`, 201);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}

// --- OPERAÇÃO 2: LEITURA ---
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
    const { search } = req.query;

    const filters: {
      search?: string;
    } = {};

    if (typeof search === 'string') filters.search = search;

    if (filters.search && filters.search.length > 80) {
      return sendFailure(res, 'INVALID_INPUT', 'Busca muito longa', undefined, 400);
    }

    const books = await listBooks(filters);

    if (books.length === 0) {
      return sendFailure(res, 'NOT_FOUND', 'Nenhum livro encontrado com os filtros informados', undefined, 404);
    }

    return sendSuccess(res, books, 200);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}

export async function listCategoriesController(req: Request, res: Response) {
  try {
    const categories = await listCategories();
    return sendSuccess(res, categories, 200);
  } catch (error) {
    return handleError(res, error, 'Categorias');
  }
}

// --- OPERAÇÃO 3: ATUALIZAÇÃO ---
export async function updateBookController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do livro inválido.');
    }

    const data = UpdateBookSchema.parse(req.body);

    await updateBook(id as string, data);

    return sendSuccess(res, `Livro atualizado com sucesso!`, 202);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}

// --- OPERAÇÃO 4: DELETAR ---
export async function deleteBookController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do livro informado não é válido.');
    }

    await deleteBook(id as string);

    return sendSuccess(res, `Livro deletado com sucesso`, 202);
  } catch (error) {
    return handleError(res, error, 'Livro');
  }
}
