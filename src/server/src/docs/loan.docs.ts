import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { NotFoundErrorSchema } from '@/models/ErrorModel';
import { LoanSchema, LoanCreateSchema, LoanUpdateSchema } from '@/services/loan/schema';

export const loanRegistry = new OpenAPIRegistry();

// --- LISTAR TODOS ---
loanRegistry.registerPath({
  method: 'get',
  path: '/loans',
  summary: 'Retorna todos os empréstimos',
  tags: ['Loans'],
  responses: {
    200: {
      description: 'Lista de empréstimos recuperada com sucesso',
      content: {
        'application/json': { schema: z.array(LoanSchema) },
      },
    },
  },
});

// --- BUSCAR POR ID ---
loanRegistry.registerPath({
  method: 'get',
  path: '/loans/{id}',
  summary: 'Busca um empréstimo pelo ID',
  tags: ['Loans'],
  request: {
    params: z.object({ id: z.string().uuid().describe('ID do empréstimo') }),
  },
  responses: {
    200: {
      description: 'Empréstimo encontrado',
      content: { 'application/json': { schema: LoanSchema } },
    },
    404: {
      description: 'Empréstimo não encontrado',
      content: { 'application/json': { schema: NotFoundErrorSchema } },
    },
  },
});

// --- CRIAR EMPRÉSTIMO ---
loanRegistry.registerPath({
  method: 'post',
  path: '/loans',
  summary: 'Cria um novo empréstimo',
  tags: ['Loans'],
  request: {
    body: {
      content: {
        'application/json': { schema: LoanCreateSchema },
      },
    },
  },
  responses: {
    201: { description: 'Empréstimo criado com sucesso' },
    400: { description: 'Erro na requisição (ex: livro indisponível)' },
  },
});

// --- ATUALIZAR (PUT) ---
loanRegistry.registerPath({
  method: 'put',
  path: '/loans/{id}',
  summary: 'Atualiza um empréstimo existente',
  tags: ['Loans'],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': { schema: LoanUpdateSchema },
      },
    },
  },
  responses: {
    200: { description: 'Empréstimo atualizado com sucesso' },
  },
});

// --- DELETAR ---
loanRegistry.registerPath({
  method: 'delete',
  path: '/loans/{id}',
  summary: 'Remove um registro de empréstimo',
  tags: ['Loans'],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: { description: 'Empréstimo deletado com sucesso' },
  },
});

// --- FILTRAR POR ESTUDANTE ---
loanRegistry.registerPath({
  method: 'get',
  path: '/loans/student/{studentId}',
  summary: 'Lista empréstimos de um estudante específico',
  tags: ['Loans'],
  request: {
    params: z.object({ studentId: z.string().uuid() }),
  },
  responses: {
    200: {
      description: 'Empréstimos do estudante recuperados',
      content: { 'application/json': { schema: z.array(LoanSchema) } },
    },
  },
});

// --- FILTRAR POR STATUS ---
loanRegistry.registerPath({
  method: 'get',
  path: '/loans/status/{status}',
  summary: 'Filtra empréstimos por situação',
  tags: ['Loans'],
  request: {
    params: z.object({
      status: z.enum(['in_progress', 'returned', 'canceled', 'overdue']),
    }),
  },
  responses: {
    200: {
      description: 'Empréstimos filtrados por status',
      content: { 'application/json': { schema: z.array(LoanSchema) } },
    },
  },
});
