import { Router } from 'express';

import UserRouter from './user.routes';
import BookRouter from './book.routes';
import WishlistRouter from './wishlist.routes';
import LoanRouter from './loans.routes';

const router = Router();

router.use(UserRouter);
router.use(BookRouter);
router.use(WishlistRouter);
router.use(LoanRouter);

export default router;
