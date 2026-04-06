import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

import { wishlistRegistry } from './wishlist.docs';
import { loanRegistry } from './loan.docs';
import { reviewRegistry } from './review.docs';
import { authorRegistry } from './author.docs';
import { userRegistry } from './user.docs';

const registry = new OpenAPIRegistry([
  wishlistRegistry, 
  loanRegistry, 
  reviewRegistry, 
  authorRegistry, 
  userRegistry
]);

export default registry;
