import { Router } from 'express';

import { getAllUsersController, createMockUserController } from '@/controllers';

const router = Router();

router.get('/users', getAllUsersController);
router.post('/users', createMockUserController);

export default router;
