import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { z } from '../lib/zod';

import { AddBookToWishlistSchema } from '@/models/WishlistModel';
import { NotFoundErrorSchema, ValidationErrorSchema } from '@/models/ErrorModel';
import { GetBooksArray } from '@/models/BookModel';

const registry = new OpenAPIRegistry();

// Wishlists

registry.registerPath({
  method: 'post',
  path: '/wishlist/register',
  summary: 'Adiciona livro na lista de desejos de um usuário',
  request: {
    params: AddBookToWishlistSchema,
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

registry.registerPath({
  method: 'get',
  path: '/wishlist/{id}',
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

registry.registerPath({
  method: 'delete',
  path: '/students/{studentid}/books/{bookId}',
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

export default registry;
