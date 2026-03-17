import { Router } from 'express';
import { createUserController, getUserByIdController, updateUserController, deleteUserController } from '@/controllers';

const UserRouter = Router();

UserRouter.post('/users/register', createUserController);
UserRouter.get('/users/:id', getUserByIdController);
UserRouter.put('/users/:id', updateUserController);
UserRouter.delete('/users/:id', deleteUserController);

export default UserRouter;
