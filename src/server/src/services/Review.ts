import { prisma } from '@/lib/prisma';
import type { CreateReviewInput } from '@/models/ReviewModel';

export async function createReview(data: CreateReviewInput) {
  return prisma.review.create({
    data: {
      rating: data.rating,
      loanId: data.loanId,
      date: data.date,
      description: data.description ?? null,
    },
    include: {
      loan: {
        include: {
          student: true,
          book: true,
        },
      },
    },
  });
}

export async function getReviews() {
  return prisma.review.findMany({
    include: {
      loan: {
        include: {
          student: true,
          book: true,
        },
      },
    },
  });
}

export async function getReviewById(id: string) {
  return prisma.review.findUnique({
    where: { id },
    include: {
      loan: {
        include: {
          student: true,
          book: true,
        },
      },
    },
  });
}

export async function deleteReview(id: string) {
  return prisma.review.delete({
    where: { id },
  });
}

export async function getReviewsByUserId(userId: string) {
  return prisma.review.findMany({
    where: {
      loan: {
        studentId: userId,
      },
    },
    include: {
      loan: {
        include: {
          student: true,
          book: true,
        },
      },
    },
  });
}

export async function getReviewsByBookId(bookId: string) {
  return prisma.review.findMany({
    where: {
      loan: {
        bookId: bookId,
      },
    },
    include: {
      loan: {
        include: {
          student: true,
          book: true,
        },
      },
    },
  });
}