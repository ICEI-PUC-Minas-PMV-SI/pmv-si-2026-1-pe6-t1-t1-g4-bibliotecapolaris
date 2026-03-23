import { Router } from 'express';
import UserRouter from './user.routes';
import BookRouter from './book.routes';

const router = Router();

router.use(UserRouter);
router.use(BookRouter);

export default router;
