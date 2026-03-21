import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import paths_registry from '../docs/paths-registry';

export const generateOpenApiDocuments = () => {
  const generator = new OpenApiGeneratorV31(paths_registry.definitions);

  generator.generateComponents();

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'My API',
      description: 'This is the API',
    },
    servers: [{ url: 'v1' }],
  });
};
