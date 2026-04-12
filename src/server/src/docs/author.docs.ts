import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { NotFoundErrorSchema } from '@/models/ErrorModel';
import { CreateAuthorSchema, UpdateAuthorSchema } from '@/models/AuthorModel';

export const AuthorSchema = CreateAuthorSchema.extend({
  id: z.string().uuid().describe('ID do autor no banco de dados'),
});

export const authorRegistry = new OpenAPIRegistry();

// --- LISTAR TODOS ---
authorRegistry.registerPath({
  method: 'get',
  path: '/author',
  summary: 'Retorna todos os autores',
  tags: ['Authors'],
  responses: {
    200: {
      description: 'Lista de autores recuperada com sucesso',
      content: {
        'application/json': { schema: z.array(AuthorSchema) },
      },
    },
  },
});

// --- BUSCAR POR ID ---
authorRegistry.registerPath({
  method: 'get',
  path: '/author/{id}',
  summary: 'Busca um autor pelo ID',
  tags: ['Authors'],
  request: {
    params: z.object({ id: z.string().uuid().describe('ID do autor') }),
  },
  responses: {
    200: {
      description: 'Autor encontrado',
      content: { 'application/json': { schema: AuthorSchema } },
    },
    404: {
      description: 'Autor não encontrado',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- CRIAR AUTOR ---
authorRegistry.registerPath({
  method: 'post',
  path: '/author',
  summary: 'Cria um novo autor',
  tags: ['Authors'],
  request: {
    body: {
      content: {
        'application/json': { schema: CreateAuthorSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Autor criado com sucesso',
      content: { 'application/json': { schema: AuthorSchema } },
    },
    400: { description: 'Erro na requisição (ex: nome faltando ou muito curto)' },
  },
});

// --- ATUALIZAR (PUT) ---
authorRegistry.registerPath({
  method: 'put',
  path: '/author/{id}',
  summary: 'Atualiza um autor existente',
  tags: ['Authors'],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: UpdateAuthorSchema },
      },
    },
  },
  responses: {
    200: { description: 'Autor atualizado com sucesso' },
    404: { description: 'Autor não encontrado para atualização' },
  },
});

// --- BUSCAR LIVROS DO AUTOR ---
authorRegistry.registerPath({
  method: 'get',
  path: '/author/{id}/books',
  summary: 'Retorna os livros de um autor',
  tags: ['Authors'],
  request: {
    params: z.object({ id: z.string().uuid().describe('ID do autor') }),
  },
  responses: {
    200: {
      description: 'Livros do autor recuperados com sucesso',
    },
    404: {
      description: 'Autor não encontrado',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- DELETAR ---
authorRegistry.registerPath({
  method: 'delete',
  path: '/author/{id}',
  summary: 'Remove um registro de autor',
  tags: ['Authors'],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: { description: 'Autor deletado com sucesso' },
    404: { description: 'Autor não encontrado para deleção' },
  },
});
