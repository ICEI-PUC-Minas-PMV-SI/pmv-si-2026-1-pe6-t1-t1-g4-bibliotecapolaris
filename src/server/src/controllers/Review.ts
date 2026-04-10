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
import { handleError, sendSuccess } from '@/utils';

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

    if (!id || Array.isArray(id)) {
      throw new Error('ID da avaliação inválido.');
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

    if (!id || Array.isArray(id)) {
      throw new Error('ID da avaliação inválido.');
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
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new Error('ID da avaliação inválido.');
    }

    await deleteReview(id as string);
    return sendSuccess(res, 'Review removida com sucesso', 202);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function getReviewsByUserIdController(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      throw new Error('ID do usuário inválido.');
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
      return handleError(res, new Error('Id do livro é obrigatório'), 'Review');
    }

    const reviews = await getReviewsByBookId(bookId);
    return sendSuccess(res, reviews, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}
