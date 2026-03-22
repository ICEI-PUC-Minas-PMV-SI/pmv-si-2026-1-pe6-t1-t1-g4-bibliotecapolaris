import type { Response } from 'express';

import { sendFailure } from '@/utils';

export function handleError(res: Response, error: unknown) {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error && typeof error.message === 'string') {
    const err = error as { code: string; message: string };
    // UNIQUE
    if (err.code === 'P2002') {
      let fields: string[] = [];

      const match = err.message.match(/\(`(.+?)`\)/);
      if (match) {
        fields = [match[1]!];
      }

      return sendFailure(res, 'UNIQUE_FIELD', 'Campo já existente no banco', fields, 400);
    }
  }

  return sendFailure(res, 'INTERNAL_ERROR', 'Erro interno do servidor', undefined, 500);
}
