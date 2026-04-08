import type { Request, Response } from 'express';

import { createAuthor, getAllAuthors, updateAuthor, getAuthorById, getBooksByAuthorId, deleteAuthor } from '@/services';
import { handleError, sendFailure, sendSuccess } from '@/utils';
import { CreateAuthorSchema, UpdateAuthorSchema } from '@/models/AuthorModel';

export async function createAuthorController(req: Request, res: Response) {
  try {
    const { name } = req.body;

    if (!name || name.length < 3) {
      return sendFailure(res, 'VALIDATION_ERROR', 'Erro de validação', undefined, 401);
    }

    const newAuthor = await createAuthor({ name });

    return sendSuccess(res, 'Autor ${newAuthor.id} criado com sucesso!', 201);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}

export async function getAllAuthorController(req: Request, res: Response) {
  try {
    const authors = await getAllAuthors();

    // Retorna o array diretamente, sem wrapper { data: [...] }
    return res.status(200).json(authors);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}

export async function getAuthorByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const author = await getAuthorById(id as string);

    // Retorna o objeto diretamente (res.body.id e res.body.name no teste)
    return sendSuccess(res, author, 200);
  } catch (error) {
    return handleError(res, error, 'Author');
  }
}

export async function getBooksByAuthorIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const books = await getBooksByAuthorId(id as string);

    return sendSuccess(res, books, 200);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}

export async function updateAuthorController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do autor inválido.');
    }

    const { name } = req.body;

    const updatedAuthor = await updateAuthor(id as string, { name });

    // Retorna o objeto atualizado diretamente (res.body.name no teste) com status 200
    return res.status(200).json(updatedAuthor);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}

export async function deleteAuthorController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await deleteAuthor(id as string);

    // Teste espera status 200
    return res.status(200).json({ message: 'Autor removido com sucesso' });
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}
