import type { Request, Response } from 'express';

import { handleError, hashPassword, sendSuccess, verifyPassword } from '@/utils';
import { createUser, getUserById, updateUser, deleteUser } from '@/services';
import { CreateUserSchema, UpdateUserSchema } from '@/models/UserModel';

export async function createUserController(req: Request, res: Response) {
  try {
    const data = CreateUserSchema.parse(req.body);

    const hashedPassword = await hashPassword(data.password);

    const newUser = await createUser({ ...data, password: hashedPassword });

    return sendSuccess(res, `Usuário criado com sucesso!`, 201);
  } catch (error: any) {
    return handleError(res, error, 'Usuário');
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do usuário inválido.');
    }

    const user = await getUserById(id as string);

    return sendSuccess(res, user, 200);
  } catch (error: any) {
    return handleError(res, error, 'Usuário');
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do usuário inválido.');
    }

    const updateData = UpdateUserSchema.parse(req.body);

    await updateUser(id as string, updateData);

    return sendSuccess(res, `Usuário atualizado com sucesso!`, 202);
  } catch (error: unknown) {
    return handleError(res, error, 'Usuário');
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await deleteUser(id as string);

    return sendSuccess(res, `Usuário deletado com sucesso!`, 202);
  } catch (error: any) {
    return handleError(res, error, 'Usuário');
  }
}
