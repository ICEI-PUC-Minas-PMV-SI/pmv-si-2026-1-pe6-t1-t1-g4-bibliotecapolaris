import { Router } from 'express';

import {
  createReviewController,
  getReviewsController,
  getReviewByIdController,
  deleteReviewController,
} from '@/controllers/Review';

const ReviewRouter = Router();

ReviewRouter.post('/review', createReviewController);
ReviewRouter.get('/review', getReviewsController);
ReviewRouter.get('/review/:id', getReviewByIdController);
ReviewRouter.delete('/review', deleteReviewController);

export default ReviewRouter;