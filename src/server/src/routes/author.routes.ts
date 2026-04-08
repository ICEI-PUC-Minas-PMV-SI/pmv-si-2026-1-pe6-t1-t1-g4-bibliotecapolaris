import { Router } from 'express';

import {
  createAuthorController,
  getAllAuthorController,
  getAuthorByIdController,
  getBooksByAuthorIdController,
  updateAuthorController,
  deleteAuthorController,
} from '@/controllers';

const AuthorRouter = Router();

AuthorRouter.post('/author', createAuthorController);

AuthorRouter.get('/author', getAllAuthorController);

AuthorRouter.get('/author/:id', getAuthorByIdController);

AuthorRouter.get('/author/:id/books', getBooksByAuthorIdController);

AuthorRouter.put('/author/:id', updateAuthorController);

AuthorRouter.delete('/author/:id', deleteAuthorController);

export default AuthorRouter;
