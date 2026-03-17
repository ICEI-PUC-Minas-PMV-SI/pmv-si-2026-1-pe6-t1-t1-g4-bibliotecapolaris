import { Prisma } from '@prisma/client';
import type { Response } from 'express';
import { sendFailure } from '@/utils';
import { ZodError } from 'zod';

export function handleError(res: Response, error: unknown) {
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
    // UNIQUE
    if (error.code === 'P2002') {
      let fields: string[] = [];

      const match = error.message.match(/\(`(.+?)`\)/);
      if (match) {
        fields = [match[1]!];
      }

      return sendFailure(res, 'UNIQUE_FIELD', 'Campo já existente no banco', fields, 400);
    }
  }

  console.error('[UNEXPECTED ERROR]', error);
  return sendFailure(res, 'INTERNAL_ERROR', 'Erro interno do servidor', undefined, 500);
}
