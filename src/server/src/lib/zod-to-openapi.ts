import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import paths_registry from '../docs/paths-registry';

export const generateOpenApiDocuments = () => {
  const generator = new OpenApiGeneratorV31(paths_registry.definitions);

  generator.generateComponents();

  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'RESTAPI Biblioteca POLARIS',
      description: 'Essa é a API que será consumida pelo frontend da Biblioteca POLARIS. Ela é responsável por gerenciar os dados dos usuários, livros, empréstimos e outras funcionalidades relacionadas à biblioteca.',
    },
    servers: [{ url: 'v1' }],
  });
};
