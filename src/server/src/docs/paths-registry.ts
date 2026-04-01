import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { wishlistRegistry } from './wishlist.docs';
import { loanRegistry } from './loan.docs';

const registry = new OpenAPIRegistry([wishlistRegistry, loanRegistry]);

export default registry;
