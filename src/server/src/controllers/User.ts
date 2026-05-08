import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { handleError, hashPassword, sendSuccess, verifyPassword } from '@/utils';
import { createUser, getUserById, updateUser, deleteUser, getUserBySlug } from '@/services';
import { CreateUserSchema, UpdateUserSchema } from '@/models/UserModel';
import { prisma } from '@/lib/prisma';

function signToken(user: { id: string; slug: string; type: string }) {
  return jwt.sign({ id: user.id, slug: user.slug, type: user.type }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  } as jwt.SignOptions);
}

export async function createUserController(req: Request, res: Response) {
  try {
    const data = CreateUserSchema.parse(req.body);

    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      return res.status(400).json({ message: 'Este e-mail já está em uso. Tente outro ou faça login.' });
    }

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

export async function getUserBySlugController(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    if (!slug || Array.isArray(slug)) {
      throw new Error('ID do usuário inválido.');
    }

    const user = await getUserBySlug(slug as string);

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

    const requestingUser = req.user!;

    // Estudante só pode atualizar o próprio nome
    let updateData: any;
    if (requestingUser.type === 'administrator') {
      updateData = UpdateUserSchema.parse(req.body);
    } else {
      const { name } = req.body;
      updateData = { name: name?.trim() };
      if (!updateData.name) {
        return res.status(400).json({ error: true, message: 'Somente o nome pode ser atualizado.' });
      }
    }

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

export const loginUserController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Conta bloqueada. Entre em contato com o suporte.' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'E-mail ou senha incorretos.' });
    }

    const token = signToken(user);

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: { id: user.id, name: user.name, email: user.email, slug: user.slug, type: user.type },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
