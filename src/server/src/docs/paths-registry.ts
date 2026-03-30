import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { z } from '../lib/zod';
import { LoanCreateSchema, LoanUpdateSchema, LoanSchema } from '../services/loan/schema';

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

registry.registerPath({
  method: 'get',
  path: '/loans',
  summary: 'Get all loans',
  responses: {
    200: {
      description: 'Loans retrieved successfully',
      content: {
        'application/json': {
          schema: z.array(LoanSchema),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/loans/{id}',
  summary: 'Get a loan by ID',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'Loan found',
      content: {
        'application/json': {
          schema: LoanSchema,
        },
      },
    },
    404: {
      description: 'Loan not found',
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/loans',
  summary: 'Create a loan',
  request: {
    body: {
      content: {
        'application/json': {
          schema: LoanCreateSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Loan created',
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/loans/{id}',
  summary: 'Update a loan',
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: LoanUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Loan updated',
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/loans/{id}',
  summary: 'Delete a loan',
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: 'Loan deleted',
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/loans/student/{studentId}',
  summary: 'Get loans by student',
  request: {
    params: z.object({ studentId: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'Loans retrieved by student',
      content: {
        'application/json': {
          schema: z.array(LoanSchema),
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/loans/status/{status}',
  summary: 'Get loans by status',
  request: {
    params: z.object({ status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']) }),
  },
  responses: {
    200: {
      description: 'Loans retrieved by status',
      content: {
        'application/json': {
          schema: z.array(LoanSchema),
        },
      },
    },
  },
});

export default registry;
