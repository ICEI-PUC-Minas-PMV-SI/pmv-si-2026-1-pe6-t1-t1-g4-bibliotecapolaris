import { Router } from 'express';
import { getAllUsersController, createMockUserController, createUserController, getUserByIdController, updateUserController, deleteUserController } from '@/controllers';

const router = Router();

router.get('/users', getAllUsersController);
router.post('/users', createMockUserController);
router.post('/users/register', createUserController);
router.get('/users/:id', getUserByIdController);
router.put('/users/:id', updateUserController);
router.delete('/users/:id', deleteUserController);

export default router;
