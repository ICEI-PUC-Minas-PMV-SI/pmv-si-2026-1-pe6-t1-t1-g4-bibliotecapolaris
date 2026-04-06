import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { wishlistRegistry } from './wishlist.docs';
import { loanRegistry } from './loan.docs';
import { reviewRegistry } from './review.docs';
import { bookRegistry } from './book.docs';

const registry = new OpenAPIRegistry([wishlistRegistry, loanRegistry, reviewRegistry, bookRegistry]);

export default registry;
