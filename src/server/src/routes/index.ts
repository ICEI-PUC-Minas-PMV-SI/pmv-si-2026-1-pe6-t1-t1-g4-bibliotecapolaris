import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiDocuments } from '@/lib/zod-to-openapi';

import UserRouter from './user.routes';
import BookRouter from './book.routes';
import WishlistRouter from './wishlist.routes';
import ReviewRouter from './review.routes';

const router = Router();

const document = generateOpenApiDocuments();

router.use('/docs', swaggerUi.serve, swaggerUi.setup(document));

router.use(UserRouter);
router.use(BookRouter);
router.use(WishlistRouter);
router.use(ReviewRouter);

export default router;
