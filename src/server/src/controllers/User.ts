import type { Request, Response } from 'express';

import { handleError, hashPassword, sendFailure, sendSuccess, verifyPassword } from '@/utils';
import { createUser, getUserById, updateUser, deleteUser } from '@/services';
import { CreateUserSchema, UpdateUserSchema } from '@/models/UserModel';

export async function createUserController(req: Request, res: Response) {
  try {
    const data = CreateUserSchema.parse(req.body);

    const hashedPassword = await hashPassword(data.password);

    const newUser = await createUser({ ...data, password: hashedPassword });

    return sendSuccess(res, `Usuário ${newUser.id} criado com sucesso!`, 201);
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function getUserByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await getUserById(id as string);

    if (!user) {
      return sendFailure(res, '404', 'Usuário não encontrado!');
    }

    return sendSuccess(res, user, 202);
  } catch (error: any) {
    return handleError(res, error);
  }
}

export async function updateUserController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID do usuário inválido.');
    }

    const updateData = UpdateUserSchema.parse(req.body);

    const updatedUser = await updateUser(id, updateData);

    return sendSuccess(res, `Usuário - ${updatedUser.name} atualizado com sucesso!`, 202);
  } catch (error: unknown) {
    return handleError(res, error);
  }
}

export async function deleteUserController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await deleteUser(id as string);

    return sendSuccess(res, 'Usuário Deletado com Sucesso', 202);
  } catch (error: any) {
    return handleError(res, error);
  }
}
