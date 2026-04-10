import type { Request, Response } from 'express';

import { CreateReviewSchema, UpdateReviewSchema } from '@/models/ReviewModel';
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByUserId,
  getReviewsByBookId,
} from '@/services';
import { handleError, sendSuccess, sendFailure } from '@/utils';

export async function createReviewController(req: Request, res: Response) {
  try {
    const data = CreateReviewSchema.parse(req.body);
    const review = await createReview(data);

    return sendSuccess(
      res,
      `${review.loan.student.name} avaliou o livro ${review.loan.book.name} com nota ${review.rating}`,
      201,
    );
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function getReviewsController(req: Request, res: Response) {
  try {
    const reviews = await getReviews();
    return sendSuccess(res, reviews, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function getReviewByIdController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return sendFailure(res, 'VALIDATION_ERROR', 'Id da review é obrigatório', undefined, 400);
    }

    const review = await getReviewById(id);
    return sendSuccess(res, review, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function updateReviewController(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      return sendFailure(res, 'VALIDATION_ERROR', 'Id da review é obrigatório', undefined, 400);
    }

    const data = UpdateReviewSchema.parse(req.body);
    const review = await updateReview(id, data);
    return sendSuccess(res, review, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function deleteReviewController(req: Request, res: Response) {
  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return sendFailure(res, 'VALIDATION_ERROR', 'Id da review é obrigatório', undefined, 400);
    }

    await deleteReview(id);
    return sendSuccess(res, 'Review removida com sucesso', 202);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function getReviewsByUserIdController(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId || typeof userId !== 'string') {
      return sendFailure(res, 'VALIDATION_ERROR', 'Id do usuário é obrigatório', undefined, 400);
    }

    const reviews = await getReviewsByUserId(userId);
    return sendSuccess(res, reviews, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function getReviewsByBookIdController(req: Request, res: Response) {
  try {
    const { bookId } = req.params;

    if (!bookId || typeof bookId !== 'string') {
      return sendFailure(res, 'VALIDATION_ERROR', 'Id do livro é obrigatório', undefined, 400);
    }

    const reviews = await getReviewsByBookId(bookId);
    return sendSuccess(res, reviews, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}