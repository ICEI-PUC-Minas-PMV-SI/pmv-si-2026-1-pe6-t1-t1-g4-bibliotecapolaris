import type { Request, Response } from 'express';

// Supondo que você vá criar o schema de validação na pasta models, igual fizeram na wishlist
//import { CreateAuthorSchema, UpdateAuthorSchema } from '@/models/AuthorModel';
import { createAuthor, getAllAuthors, updateAuthor, getBooksByAuthorId, deleteAuthor } from '@/services';
import { handleError, sendSuccess } from '@/utils';

export async function createAuthorsController(req: Request, res: Response) {
  try {
    const { name } = req.body;

    // Validação manual simples para substituir o Model
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

    // Retorna os dados direto pelo sendSuccess, igual no getWishlistByUserId
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

    // Passamos o name direto para o service atualizar
    const updatedAuthor = await updateAuthor(id as string, { name });

    return sendSuccess(res, `Autor - ${updatedAuthor.name} atualizado com sucesso!`, 201);
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}

export async function deleteAuthorController(req: Request, res: Response) {
  try {
    // Nota: Para deletar um autor geralmente usamos req.params (ex: /author/:id),
    // mas se a sua equipe preferir usar req.query igual na wishlist, é só trocar aqui.
    const { id } = req.params;

    await deleteAuthor(id as string);

    return sendSuccess(res, `Autor removido com sucesso`, 202); // 202 Accepted, igual na wishlist
  } catch (error: unknown) {
    return handleError(res, error, 'Autor');
  }
}
