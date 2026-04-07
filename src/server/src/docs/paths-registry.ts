import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { wishlistRegistry } from './wishlist.docs';
import { loanRegistry } from './loan.docs';
import { reviewRegistry } from './review.docs';
import { authorRegistry } from './author.docs';
import { userRegistry } from './user.docs';
import { bookRegistry } from './book.docs';

const registry = new OpenAPIRegistry([wishlistRegistry, loanRegistry, reviewRegistry, authorRegistry, bookRegistry, userRegistry]);

export default registry;
