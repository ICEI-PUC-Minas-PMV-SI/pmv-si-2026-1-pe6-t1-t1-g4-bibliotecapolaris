import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocuments } from '@/lib/zod-to-openapi';

import UserRouter from './user.routes';
import BookRouter from './book.routes';
import WishlistRouter from './wishlist.routes';
import AuthorRouter from './author.routes';
import ReviewRouter from './review.routes';
import LoanRouter from './loans.routes';

const router = Router();

const document = generateOpenApiDocuments();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(document));

router.use(UserRouter);
router.use(BookRouter);
router.use(AuthorRouter);
router.use(WishlistRouter);
router.use(ReviewRouter);
router.use(LoanRouter);

export default router;
