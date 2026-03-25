import { Router } from 'express';

import {
  createBookController,
  deleteBookController,
  getBookByIdController,
  getBookBySlugController,
  listBooksController,
  updateBookController,
} from '@/controllers';

const BookRouter = Router();

BookRouter.post('/books/register', createBookController);
BookRouter.get('/books/:id', getBookByIdController);
BookRouter.get('/books/:slug', getBookBySlugController);
BookRouter.get('/books/', listBooksController);
BookRouter.put('/books/:id', updateBookController);
BookRouter.delete('/books/:id', deleteBookController);

export default BookRouter;
