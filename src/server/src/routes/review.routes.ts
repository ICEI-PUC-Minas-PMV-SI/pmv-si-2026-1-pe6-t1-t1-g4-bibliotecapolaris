import { Router } from 'express';

import {
  createReviewController,
  getReviewsController,
  getReviewByIdController,
  deleteReviewController,
  getReviewsByUserIdController,
  getReviewsByBookIdController,
  updateReviewController,
} from '@/controllers/Review';

const ReviewRouter = Router();

ReviewRouter.post('/review', createReviewController);
ReviewRouter.get('/review', getReviewsController);
ReviewRouter.get('/review/user/:userId', getReviewsByUserIdController);
ReviewRouter.get('/review/book/:bookId', getReviewsByBookIdController);
ReviewRouter.get('/review/:id', getReviewByIdController);
ReviewRouter.put('/review/:id', updateReviewController);
ReviewRouter.delete('/review', deleteReviewController);

export default ReviewRouter;