import { Router } from 'express';

import {
  addBookToWishlistController,
  getWishlistByUserIdController,
  deleteBookFromWishlistController,
} from '@/controllers';

const WishlistRouter = Router();

WishlistRouter.post('/wishlist/register', addBookToWishlistController);
WishlistRouter.get('/wishlist/:id', getWishlistByUserIdController);
WishlistRouter.delete('/wishlist/:studentId/:bookId', deleteBookFromWishlistController);

export default WishlistRouter;
