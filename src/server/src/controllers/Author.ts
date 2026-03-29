import type { Request, Response } from 'express';

import { createAuthor, getAllAuthors, updateAuthor, getBooksByAuthorId, deleteAuthor } from '@/services';
import { handleError, sendSuccess } from '@/utils';
import { CreateAuthorSchema, UpdateAuthorSchema } from '@/models/AuthorModel';

export async function createAuthorsController(req: Request, res: Response) {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error('O nome do autor é obrigatório.');
    }

    const newAuthor = await createAuthor({ name });

    return sendSuccess(res, `Autor ${newAuthor.id} criado com sucesso!`, 201);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}

export async function getAllAuthorsController(req: Request, res: Response) {
  try {
    const authors = await getAllAuthors();

    return sendSuccess(res, authors, 200);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
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

    return sendSuccess(res, `Autor - ${updatedAuthor.name} atualizado com sucesso!`, 201);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}

export async function deleteAuthorController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await deleteAuthor(id as string);

    return sendSuccess(res, `Autor removido com sucesso`, 202);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}
