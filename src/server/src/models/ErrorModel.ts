import { z } from '../lib/zod';

export const ValidationErrorSchema = z.object({
  error: z.boolean().openapi({ example: true }),
  errorCode: z.string().openapi({ example: 'VALIDATION_ERROR' }),
  message: z.string().openapi({ example: 'Erro de validação' }),
  field: z.record(z.string(), z.array(z.string())).openapi({
    example: {
      id: ['UUID inválido'],
    },
  }),
});

export const NotFoundErrorSchema = z.object({
  error: z.boolean().openapi({ example: true }),
  errorCode: z.string().openapi({ example: 'NOT_FOUND' }),
  message: z.string().openapi({
    example: 'Recurso não encontrado',
  }),
});
