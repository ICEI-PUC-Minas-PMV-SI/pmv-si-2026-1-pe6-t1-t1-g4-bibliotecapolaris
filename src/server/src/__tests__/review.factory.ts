import { prisma } from '@/lib/prisma';
import { MOCK_USER_ID, MOCK_BOOK_ID } from './wishlist.factory';

export const MOCK_LOAN_ID = '5a6e1234-7b8c-4d9e-bf10-112233445566';
export const MOCK_REVIEW_ID = 'c1d2e3f4-a5b6-7890-cdef-112233445566';

export { MOCK_USER_ID, MOCK_BOOK_ID };

export async function createLoan() {
  return prisma.loan.create({
    data: {
      id: MOCK_LOAN_ID,
      studentId: MOCK_USER_ID,
      bookId: MOCK_BOOK_ID,
      loanDate: '2026-04-10',
      dueDate: '2026-04-17',
      status: 'in_progress',
    },
  });
}

export async function createReview() {
  return prisma.review.create({
    data: {
      id: MOCK_REVIEW_ID,
      rating: 5,
      loanId: MOCK_LOAN_ID,
      description: 'Ótimo livro!',
      date: '2026-04-10',
    },
  });
}