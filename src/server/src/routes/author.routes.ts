import { Router } from 'express';

import {
  createAuthorsController,
  getAllAuthorsController,
  getBooksByAuthorIdController,
  updateAuthorController,
  deleteAuthorController,
} from '@/controllers';

const AuthorRouter = Router();

AuthorRouter.post('/author', createAuthorsController);

AuthorRouter.get('/author', getAllAuthorsController);

AuthorRouter.get('/author/:id/books', getBooksByAuthorIdController);

AuthorRouter.put('/author/:id', updateAuthorController);

AuthorRouter.delete('/author/:id', deleteAuthorController);

export default AuthorRouter;
