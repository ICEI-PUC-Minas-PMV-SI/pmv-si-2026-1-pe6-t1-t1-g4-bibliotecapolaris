import { Router } from 'express';
import UserRouter from './user.routes';
import EditionRouter from './edition.routes';

const router = Router();

router.use(UserRouter);
router.use(EditionRouter);

export default router;
