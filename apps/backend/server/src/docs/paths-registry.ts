import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { z } from '../lib/zod';

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

export default registry;
