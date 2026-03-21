import type { Response } from 'express';

// eslint-disable-next-line import/no-unresolved
import { Prisma } from '../../prisma/generated/prisma/client';

import { sendFailure } from '@/utils';

export function handleError(res: Response, error: unknown) {
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

  return sendFailure(res, 'INTERNAL_ERROR', 'Erro interno do servidor', undefined, 500);
}
