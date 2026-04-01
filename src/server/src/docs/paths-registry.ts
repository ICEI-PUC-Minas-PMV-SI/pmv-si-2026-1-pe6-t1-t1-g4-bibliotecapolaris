import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { bookRegistry } from './book.docs';

const registry = new OpenAPIRegistry([bookRegistry]);

export default registry;
