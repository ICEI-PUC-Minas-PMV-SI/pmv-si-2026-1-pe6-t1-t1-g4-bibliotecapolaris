import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { CreateUserSchema, UpdateUserSchema } from '@/models/UserModel';
import { ValidationErrorSchema, NotFoundErrorSchema } from '@/models/ErrorModel';

export const userRegistry = new OpenAPIRegistry();

// --- POST (Criar Usuário) ---
userRegistry.registerPath({
  method: 'post',
  path: '/users/register',
  tags: ['Users'],
  summary: 'Registra um novo usuário no sistema',
  request: {
    body: {
      content: {
        'application/json': { schema: CreateUserSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Usuário criado com sucesso!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'boolean', example: false },
              data: { type: 'string', example: 'Usuário f995d968... criado com sucesso!' },
            },
          },
        },
      },
    },
    400: {
      description: 'Erro de validação dos dados enviados',
      content: { 'application/json': { schema: ValidationErrorSchema } },
    },
  },
});

// --- GET (Buscar Usuário por ID) ---
userRegistry.registerPath({
  method: 'get',
  path: '/users/{id}',
  tags: ['Users'],
  summary: 'Retorna os dados de um usuário específico',
  request: {
    params: z.object({ id: z.string().uuid().describe('ID do Usuário') }),
  },
  responses: {
    200: {
      description: 'Usuário encontrado!',
      content: { 'application/json': { schema: z.any() } }, 
    },
    404: {
      description: 'Usuário não encontrado!',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- PUT (Atualizar Usuário) ---
userRegistry.registerPath({
  method: 'put',
  path: '/users/{id}',
  tags: ['Users'],
  summary: 'Atualiza os dados de um usuário existente',
  request: {
    params: z.object({ id: z.string().uuid().describe('ID do Usuário') }),
    body: {
      content: {
        'application/json': { schema: UpdateUserSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Usuário atualizado com sucesso!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'boolean', example: false },
              data: { type: 'string', example: 'Usuário - Filipe atualizado com sucesso!' },
            },
          },
        },
      },
    },
    400: {
      description: 'Erro na validação (Ex: Senha antiga incorreta)',
      content: { 'application/json': { schema: ValidationErrorSchema } },
    },
  },
});

// --- DELETE (Deletar Usuário) ---
userRegistry.registerPath({
  method: 'delete',
  path: '/users/{id}',
  tags: ['Users'],
  summary: 'Remove um usuário do banco de dados',
  request: {
    params: z.object({ id: z.string().uuid().describe('ID do Usuário') }),
  },
  responses: {
    201: {
      description: 'Usuário deletado com sucesso!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'boolean', example: false },
              data: { type: 'string', example: 'Usuário Deletado com Sucesso' },
            },
          },
        },
      },
    },
    404: {
      description: 'Usuário não encontrado!',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});