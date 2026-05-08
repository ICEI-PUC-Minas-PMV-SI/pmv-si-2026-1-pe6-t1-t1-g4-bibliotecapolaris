import { Router } from 'express';

import {
  addBookToWishlistController,
  getWishlistByUserIdController,
  deleteBookFromWishlistController,
} from '@/controllers';
import { requireAuth, requireSelfWishlist } from '@/middleware/auth';

const WishlistRouter = Router();

WishlistRouter.post('/wishlist/register', requireAuth, requireSelfWishlist, addBookToWishlistController);
WishlistRouter.get('/wishlist/:id', requireAuth, requireSelfWishlist, getWishlistByUserIdController);
WishlistRouter.delete('/wishlist/:studentId/:bookId', requireAuth, requireSelfWishlist, deleteBookFromWishlistController);

export default WishlistRouter;
