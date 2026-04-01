import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { GetBooksArray } from '@/models/BookModel';
import { AddBookToWishlistSchema } from '@/models/WishlistModel';
import { ValidationErrorSchema, NotFoundErrorSchema } from '@/models/ErrorModel';

export const wishlistRegistry = new OpenAPIRegistry();

// --- POST ---
wishlistRegistry.registerPath({
  method: 'post',
  path: '/wishlist/register',
  tags: ['Wishlist'],
  summary: 'Adiciona livro na lista de desejos de um usuário',
  request: {
    body: {
      content: {
        'application/json': { schema: AddBookToWishlistSchema },
      },
    },
  },

  responses: {
    201: {
      description: 'Livro adicionado com sucesso!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Livro adicionado com sucesso',
              },
            },
          },
        },
      },
    },
    401: {
      description: 'IDs inválidos para criação',
      content: {
        'application/json': {
          schema: ValidationErrorSchema,
        },
      },
    },
  },
});

// --- GET ---
wishlistRegistry.registerPath({
  method: 'get',
  path: '/wishlist/{id}',
  tags: ['Wishlist'],
  summary: 'Retorna todos os livros na lista de desejos de um usuário',
  request: {
    params: z.object({ id: z.uuid().describe('ID do Estudante') }),
  },

  responses: {
    200: {
      description: 'Livros encontrados!',
      content: {
        'application/json': {
          schema: GetBooksArray,
        },
      },
    },
    404: {
      description: 'Nenhum livro encontrado na lista de desejos!',
      content: {
        'application/json': {
          schema: NotFoundErrorSchema,
        },
      },
    },
  },
});

// --- DELETE ---
wishlistRegistry.registerPath({
  method: 'delete',
  path: '/wishlist/{studentId}/{bookId}',
  tags: ['Wishlist'],
  summary: 'Remove o livro da lista de desejos do usuário',
  request: {
    params: z.object({ studentId: z.uuid().describe('ID do Estudante'), bookId: z.uuid().describe('ID do Livro') }),
  },

  responses: {
    200: {
      description: 'Livro removido com sucesso!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Livro removido com sucesso!',
              },
            },
          },
        },
      },
    },
    404: {
      description: 'Lista de desejos não encontrada!',
      content: {
        'application/json': {
          schema: NotFoundErrorSchema,
        },
      },
    },
  },
});
