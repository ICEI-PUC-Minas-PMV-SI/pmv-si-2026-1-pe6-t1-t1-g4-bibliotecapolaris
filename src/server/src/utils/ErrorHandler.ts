import type { Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

import { sendFailure } from '@/utils';

export function handleError(res: Response, error: unknown, entity = 'Registro') {
  // Zod
  if (error instanceof ZodError) {
    const fieldsMap = new Map<string, string[]>();

    for (const issue of error.issues) {
      const path = issue.path.join('.');

      const messages = fieldsMap.get(path) ?? [];
      messages.push(issue.message);

      fieldsMap.set(path, messages);
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // UNIQUE
    if (error.code === 'P2002') {
      let fields: string[] = [];

      const match = error.message.match(/\(`(.+?)`\)/);
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
