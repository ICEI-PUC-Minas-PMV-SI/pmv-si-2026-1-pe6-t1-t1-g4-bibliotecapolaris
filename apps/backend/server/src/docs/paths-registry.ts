import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { z } from '../lib/zod';
import { LoanCreateSchema, LoanUpdateSchema, LoanSchema } from '../services/loan/schema';

const registry = new OpenAPIRegistry();

//SCHEMAS DEVEM SER IMPORTADOS DE CADA MÉTODO!
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  createdAt: z.date(),
});

//EXEMPLO, É ASSIM QUE DEVEM FICAR AS ROTAS
registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  summary: 'Get a single user',
  request: {
    params: z.object({ id: z.string() }),
  },

  responses: {
    200: {
      description: 'User found',
      content: {
        'application/json': {
          schema: UserSchema,
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
