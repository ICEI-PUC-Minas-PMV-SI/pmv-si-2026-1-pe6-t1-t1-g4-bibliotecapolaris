import { Router } from 'express';

import {
  createBookController,
  deleteBookController,
  getBookByIdController,
  getBookBySlugController,
  listBooksController,
  updateBookController,
  listCategoriesController,
} from '@/controllers';
import { requireAuth, requireAdmin } from '@/middleware/auth';

const BookRouter = Router();

// Públicas (leitura)
BookRouter.get('/books', listBooksController);
BookRouter.get('/books/categories', listCategoriesController);
BookRouter.get('/books/id/:id', getBookByIdController);
BookRouter.get('/books/:slug', getBookBySlugController);

// Admin only (escrita)
BookRouter.post('/books/register', requireAuth, requireAdmin, createBookController);
BookRouter.put('/books/:id', requireAuth, requireAdmin, updateBookController);
BookRouter.delete('/books/:id', requireAuth, requireAdmin, deleteBookController);

export default BookRouter;
