import { Router } from 'express';

import {
  createAuthorsController,
  getAllAuthorsController,
  getBooksByAuthorIdController,
  updateAuthorController,
  deleteAuthorController,
} from '@/controllers';

const AuthorRouter = Router();

// Criar autor
AuthorRouter.post('/author', createAuthorsController);

// Listar todos os autores
AuthorRouter.get('/author', getAllAuthorsController);

// Buscar todos os livros de um autor específico
AuthorRouter.get('/author/:id/books', getBooksByAuthorIdController);

// Atualizar autor
AuthorRouter.put('/author/:id', updateAuthorController);

// Deletar autor
AuthorRouter.delete('/author/:id', deleteAuthorController);

export default AuthorRouter;
