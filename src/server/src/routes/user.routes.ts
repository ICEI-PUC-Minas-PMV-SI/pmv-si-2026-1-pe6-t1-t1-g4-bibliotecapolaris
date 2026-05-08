import { Router } from 'express';

import {
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
  loginUserController,
  getUserBySlugController,
} from '@/controllers';
import { requireAuth, requireAdmin, requireSelfOrAdmin } from '@/middleware/auth';

const UserRouter = Router();

// Públicas
UserRouter.post('/users/register', createUserController);
UserRouter.post('/users/login', loginUserController);

// Autenticadas
UserRouter.get('/users/slug/:slug', getUserBySlugController);
UserRouter.get('/users/:id', requireAuth, requireSelfOrAdmin, getUserByIdController);
UserRouter.put('/users/:id', requireAuth, requireSelfOrAdmin, updateUserController);
UserRouter.delete('/users/:id', requireAuth, requireAdmin, deleteUserController);

export default UserRouter;
