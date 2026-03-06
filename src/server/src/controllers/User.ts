import type { Request, Response } from 'express';

import { getAllUsers, createMockUser } from '@/services';
import { handleError, sendSuccess } from '@/utils';

export async function getAllUsersController(req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      error: false,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ error: true, errorCode: 'ERR_SEARCH_USERS', message: 'Erro ao buscar usuários' });
  }
}

export async function createMockUserController(_req: Request, res: Response) {
  try {
    const user = await createMockUser();

    return sendSuccess(res, `Usuário criado com sucesso com ID ${user.id}`, 201);
  } catch (error: any) {
    return handleError(res, error);
  }
}
