import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { generateOpenApiDocuments } from './zod-to-openapi';

export const swaggerRoute = () => {
  const open_api_documents = generateOpenApiDocuments();

  const router = Router();

  router.use('/', swaggerUi.serve, swaggerUi.setup(open_api_documents));

  return router;
};
