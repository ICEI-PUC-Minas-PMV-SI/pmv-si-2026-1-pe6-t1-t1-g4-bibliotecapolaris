import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { CreateBookSchema, UpdateBookSchema } from '@/models/BookModel';

// NOTA: Se NotFoundErrorSchema existir em @/models/ErrorModel, importe de lá futuramente
const NotFoundErrorSchema = z.object({
  message: z.string(),
  error: z.string().optional(),
});

export const bookRegistry = new OpenAPIRegistry();

// ESQUEMAS DE RESPOSTA
export const BookSchema = z.object({
  id: z.string().uuid().describe('ID único do livro'),
  slug: z.string().describe('URL-friendly slug do livro'),
  isbn: z.string().describe('ISBN único do livro'),
  name: z.string().describe('Título do livro'),
  year: z.number().int().describe('Ano de lançamento'),
  authorId: z.string().uuid().describe('ID do autor relacionado'),
  description: z.string().describe('Resumo do livro'),
  categories: z.string().describe('Categorias (separadas por vírgula)'),
  totalQuantity: z.number().int().describe('Estoque total'),
  totalAvailable: z.number().int().describe('Quantidade disponível para empréstimo'),
  author: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
    })
    .optional(),
});

export const BookDetailSchema = BookSchema.extend({
  loans: z.array(
    z.object({
      id: z.string().uuid(),
      reviews: z.array(
        z.object({
          id: z.string().uuid(),
          rating: z.number().int(),
          description: z.string().nullable(),
          date: z.string().datetime(),
        }),
      ),
      student: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      }),
    }),
  ),
});

// --- REGISTRAR LIVRO ---
bookRegistry.registerPath({
  method: 'post',
  path: '/books/register',
  summary: 'Registra um novo livro no sistema',
  tags: ['Books'],
  request: {
    body: {
      content: {
        'application/json': { schema: CreateBookSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'Livro registrado com sucesso',
      content: { 'application/json': { schema: BookSchema } },
    },
    400: { description: 'Erro na validação do livro' },
  },
});

// --- LISTAR LIVROS ---
bookRegistry.registerPath({
  method: 'get',
  path: '/books/list',
  summary: 'Lista livros com filtros (nome, autor, categoria, wishlist)',
  tags: ['Books'],
  request: {
    query: z.object({
      name: z.string().optional(),
      authorName: z.string().optional(),
      categories: z.string().optional(),
      wishlistId: z.string().uuid().optional().describe('ID do aluno para filtro de lista de desejos'),
    }),
  },
  responses: {
    200: {
      description: 'Lista de livros filtrada',
      content: { 'application/json': { schema: z.array(BookSchema) } },
    },
  },
});

// --- BUSCAR POR ID ---
bookRegistry.registerPath({
  method: 'get',
  path: '/books/id/{id}',
  summary: 'Busca detalhes de um livro pelo seu ID uuid',
  tags: ['Books'],
  request: {
    params: z.object({ id: z.string().uuid().describe('ID do livro') }),
  },
  responses: {
    200: {
      description: 'Livro encontrado',
      content: { 'application/json': { schema: BookDetailSchema } },
    },
    404: {
      description: 'Livro não encontrado',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- BUSCAR POR SLUG ---
bookRegistry.registerPath({
  method: 'get',
  path: '/books/slug/{slug}',
  summary: 'Busca detalhes de um livro pelo seu slug amigável',
  tags: ['Books'],
  request: {
    params: z.object({ slug: z.string().describe('Slug do livro') }),
  },
  responses: {
    200: {
      description: 'Livro encontrado',
      content: { 'application/json': { schema: BookDetailSchema } },
    },
    404: {
      description: 'Livro não encontrado',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- ATUALIZAR LIVRO ---
bookRegistry.registerPath({
  method: 'put',
  path: '/books/{id}',
  summary: 'Atualiza dados de um livro existente',
  tags: ['Books'],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: UpdateBookSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Livro atualizado com sucesso',
      content: { 'application/json': { schema: BookSchema } },
    },
    404: {
      description: 'Livro não localizado',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- DELETAR LIVRO ---
bookRegistry.registerPath({
  method: 'delete',
  path: '/books/{id}',
  summary: 'Remove um livro do acervo',
  tags: ['Books'],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: { description: 'Livro removido com sucesso' },
    404: {
      description: 'Livro não encontrado',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});
