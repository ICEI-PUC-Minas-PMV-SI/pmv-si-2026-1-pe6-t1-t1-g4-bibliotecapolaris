import type { Request, Response } from 'express';

import { CreateReviewSchema, UpdateReviewSchema } from '@/models/ReviewModel';
import {
  createReview,
  getReviews,
  getReviewById,
  deleteReview,
  getReviewsByUserId,
  getReviewsByBookId,
  updateReview,
} from '@/services';
import { handleError, sendSuccess } from '@/utils';

function getSingleString(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  return null;
}

export async function createReviewController(req: Request, res: Response) {
  try {
    const data = CreateReviewSchema.parse(req.body);

    const review = await createReview(data);

    return sendSuccess(
      res,
      `${review.loan.student.name} avaliou o livro ${review.loan.book.name}`,
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
    const id = getSingleString(req.params.id);

    if (!id) {
      throw new Error('Id da review é obrigatório');
    }

    const review = await getReviewById(id);

    return sendSuccess(res, review, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function deleteReviewController(req: Request, res: Response) {
  try {
    const id = getSingleString(req.query.id);

    if (!id) {
      throw new Error('Id da review é obrigatório');
    }

    await deleteReview(id);

    return sendSuccess(res, 'Review removida com sucesso', 202);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function getReviewsByUserIdController(req: Request, res: Response) {
  try {
    const id = getSingleString(req.params.userId);

    if (!id) {
      throw new Error('Id do usuário é obrigatório');
    }

    const reviews = await getReviewsByUserId(id);

    return sendSuccess(res, reviews, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function getReviewsByBookIdController(req: Request, res: Response) {
  try {
    const id = getSingleString(req.params.bookId);

    if (!id) {
      throw new Error('Id do livro é obrigatório');
    }

    const reviews = await getReviewsByBookId(id);

    return sendSuccess(res, reviews, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}

export async function updateReviewController(req: Request, res: Response) {
  try {
    const id = getSingleString(req.params.id);

    if (!id) {
      throw new Error('Id da review é obrigatório');
    }

    const data = UpdateReviewSchema.parse(req.body);

    const review = await updateReview(id, data);

    return sendSuccess(res, review, 200);
  } catch (error: any) {
    return handleError(res, error, 'Review');
  }
}