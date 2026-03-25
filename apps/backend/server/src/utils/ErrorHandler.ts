import type { Response } from 'express';
<<<<<<< HEAD:apps/backend/server/src/utils/ErrorHandler.ts

import { sendFailure } from '@/utils';

export function handleError(res: Response, error: unknown) {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error && typeof error.message === 'string') {
    const err = error as { code: string; message: string };
=======
import { ZodError } from 'zod';

import { Prisma } from '@prisma/client';
import { sendFailure } from '@/utils';

export function handleError(res: Response, error: unknown, entity = 'Registro') {
  // Zod
  if (error instanceof ZodError) {
    const fields: Record<string, string[]> = {};

    for (const issue of error.issues) {
      const path = issue.path.join('.');
      if (!fields[path]) fields[path] = [];
      fields[path].push(issue.message);
    }

    return sendFailure(res, 'VALIDATION_ERROR', 'Erro de validação', fields, 400);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
>>>>>>> server:src/server/src/utils/ErrorHandler.ts
    // UNIQUE
    if (err.code === 'P2002') {
      let fields: string[] = [];

      const match = err.message.match(/\(`(.+?)`\)/);
      if (match) {
        fields = [match[1]!];
      }

      return sendFailure(res, 'ERR_UNIQUE_FIELD', 'Campo já existente no banco', fields, 400);
    }

    // FOREIGN KEY NEEDED
    if (error.code === 'P2003') {
      return sendFailure(res, 'ERR_FOREIGN_KEY', 'Chave Estrangeira não existente!', [], 400);
    }

    // NOT FOUND
    if (error.code === 'P2025') {
      return sendFailure(res, 'NOT_FOUND', `${entity} não encontrado`, undefined, 404);
    }
  }

  console.error('[UNEXPECTED ERROR]', error);
  return sendFailure(res, 'INTERNAL_ERROR', 'Erro interno do servidor', undefined, 500);
}
