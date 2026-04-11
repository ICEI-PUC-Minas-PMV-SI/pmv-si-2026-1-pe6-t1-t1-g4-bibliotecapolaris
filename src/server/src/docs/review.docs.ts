import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { NotFoundErrorSchema, ValidationErrorSchema } from '@/models/ErrorModel';
import { CreateReviewSchema, UpdateReviewSchema } from '@/models/ReviewModel';

export const reviewRegistry = new OpenAPIRegistry();

// --- POST ---
reviewRegistry.registerPath({
  method: 'post',
  path: '/review',
  summary: 'Cria uma nova avaliação de livro',
  tags: ['Reviews'],
  request: {
    body: {
      content: {
        'application/json': { schema: CreateReviewSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Avaliação criada com sucesso',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'João avaliou o livro O Senhor dos Anéis com nota 5',
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Dados inválidos',
      content: { 'application/json': { schema: ValidationErrorSchema } },
    },
  },
});

// --- GET ALL ---
reviewRegistry.registerPath({
  method: 'get',
  path: '/review',
  summary: 'Retorna todas as avaliações',
  tags: ['Reviews'],
  responses: {
    200: {
      description: 'Lista de avaliações recuperada com sucesso',
      content: {
        'application/json': { schema: z.array(CreateReviewSchema) },
      },
    },
  },
});

// --- GET BY ID ---
reviewRegistry.registerPath({
  method: 'get',
  path: '/review/{id}',
  summary: 'Busca uma avaliação pelo ID',
  tags: ['Reviews'],
  request: {
    params: z.object({ id: z.string().uuid().describe('ID da avaliação') }),
  },
  responses: {
    200: {
      description: 'Avaliação encontrada',
      content: { 'application/json': { schema: CreateReviewSchema } },
    },
    404: {
      description: 'Avaliação não encontrada',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- GET BY USER ---
reviewRegistry.registerPath({
  method: 'get',
  path: '/review/user/{userId}',
  summary: 'Lista avaliações de um usuário específico',
  tags: ['Reviews'],
  request: {
    params: z.object({ userId: z.string().uuid().describe('ID do usuário') }),
  },
  responses: {
    200: {
      description: 'Avaliações do usuário recuperadas com sucesso',
      content: { 'application/json': { schema: z.array(CreateReviewSchema) } },
    },
    404: {
      description: 'Nenhuma avaliação encontrada para este usuário',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- GET BY BOOK ---
reviewRegistry.registerPath({
  method: 'get',
  path: '/review/book/{bookId}',
  summary: 'Lista avaliações de um livro específico',
  tags: ['Reviews'],
  request: {
    params: z.object({ bookId: z.string().uuid().describe('ID do livro') }),
  },
  responses: {
    200: {
      description: 'Avaliações do livro recuperadas com sucesso',
      content: { 'application/json': { schema: z.array(CreateReviewSchema) } },
    },
    404: {
      description: 'Nenhuma avaliação encontrada para este livro',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- PUT ---
reviewRegistry.registerPath({
  method: 'put',
  path: '/review/{id}',
  summary: 'Atualiza uma avaliação existente',
  tags: ['Reviews'],
  request: {
    params: z.object({ id: z.string().uuid().describe('ID da avaliação') }),
    body: {
      content: {
        'application/json': { schema: UpdateReviewSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Avaliação atualizada com sucesso',
      content: { 'application/json': { schema: CreateReviewSchema } },
    },
    404: {
      description: 'Avaliação não encontrada',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- DELETE ---
reviewRegistry.registerPath({
  method: 'delete',
  path: '/review',
  summary: 'Remove uma avaliação',
  tags: ['Reviews'],
  request: {
    params: z.object({ id: z.string().uuid().describe('ID da avaliação') }),
  },
  responses: {
    202: {
      description: 'Avaliação removida com sucesso',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Review removida com sucesso' },
            },
          },
        },
      },
    },
    404: {
      description: 'Avaliação não encontrada',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});
