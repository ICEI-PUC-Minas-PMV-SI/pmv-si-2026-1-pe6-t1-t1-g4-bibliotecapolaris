import type { Request, Response } from 'express';

import { CreateEditionSchema, UpdateEditionSchema } from '@/models/EditionModel';
import { handleError, sendFailure, sendSuccess } from '@/utils';
import { createEdition, deleteEdition, getEditionById, updateEdition } from '@/services';

export async function createEditionController(req: Request, res: Response) {
  try {
    const data = CreateEditionSchema.parse(req.body);

    const newEdition = await createEdition({ ...data });

    return sendSuccess(
      res,
      `Edição de ID ${newEdition.id} Criada com Sucesso e Vinculada ao Livro de ID ${newEdition.bookId}`,
      201,
    );
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function getEditionByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const edition = await getEditionById(id as string);

    return sendSuccess(res, edition, 200);
  } catch (error: any) {
    return handleError(res, error, 'Edição');
  }
}

export async function updateEditionController(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
      throw new Error('ID da edição inválido.');
    }

    const data = UpdateEditionSchema.parse(req.body);

    await updateEdition(id as string, data);

    return sendSuccess(res, `Edição atualizada com sucesso`, 201);
  } catch (error: any) {
    return handleError(res, error, 'Edição');
  }
}

export async function deleteEditionController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await deleteEdition(id as string);

    return sendSuccess(res, `Edição deletada com sucesso`, 201);
  } catch (error: any) {
    return handleError(res, error, 'Edição');
  }
}
